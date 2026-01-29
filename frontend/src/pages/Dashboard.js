import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../services/api";
import Layout from "../components/Layout";
import "../styles/dashboard.css";

function Dashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    const taskInputRef = useRef(null);

    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");

    const [user, setUser] = useState(null);
    const [role, setRole] = useState("staff");

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");

    const [activeStatus, setActiveStatus] = useState("In Progress");
    const [search, setSearch] = useState("");

    useEffect(() => {
        API.get("/auth/me").then(res => {
            setUser(res.data);
            setRole(res.data.role);
            if (res.data.role === "superadmin") {
                API.get("/auth/users").then(r => setUsers(r.data));
            }
        }).catch(() => {
            localStorage.removeItem("token");
            navigate("/");
        });
        fetchTasks();
    }, [navigate]);

    const fetchTasks = async () => {
        const res = await API.get("/tasks");
        setTasks(res.data);
    };

    // const normalizedTasks = tasks.map(task => ({...task, status: task.status === "Pending" ? "In Progress" : task.status}));
    const normalizedTasks = tasks.map(task => {
        if (task.status === "Pending") {
            return { ...task, status: "In Progress" };
        }
        return task;
    });
    
    const createTask = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        const payload = { title };
        if (role === "superadmin" && selectedUser) {
            payload.userId = selectedUser;
        }
        await API.post("/tasks", payload);
        setTitle("");
        setSelectedUser("");
        fetchTasks();
    };

    const updateStatus = async (id, status) => {
        await API.put(`/tasks/${id}`, { status });
        fetchTasks();
    };

    const deleteTask = async (id) => {
        await API.delete(`/tasks/${id}`);
        fetchTasks();
    };

    const focusNewTaskInput = () => {
        taskInputRef.current?.scrollIntoView({behavior: "smooth", block: "center"});
        taskInputRef.current?.focus();
    };

    useEffect(() => {
        if (location.state?.status) {
        setActiveStatus(location.state.status);
        }
    }, [location.state]);

    const total = normalizedTasks.length;
    const completed = normalizedTasks.filter(t => t.status === "Completed").length;
    const leftTasks = normalizedTasks.filter(t => t.status === activeStatus);
    const statusOrder = {"In Progress": 1,"Paused": 2,"Completed": 3};

    const sortedAllTasks = [...normalizedTasks].sort((a, b) => statusOrder[a.status] - statusOrder[b.status]).sort((a, b) => {
        if (!search) return 0;
        const aMatch = a.title.toLowerCase().includes(search.toLowerCase());
        const bMatch = b.title.toLowerCase().includes(search.toLowerCase());
        return aMatch === bMatch ? 0 : aMatch ? -1 : 1;
    });

    return (
        <Layout user={user} role={role} onNewTask={focusNewTaskInput} search={search} setSearch={setSearch} setStatusFilter={setActiveStatus} activeFilter={activeStatus}>
            <div className="dashboard-header">
                <h2>Tasks</h2>
                <div className="dashboard-stats">
                    <div className="stat-card">
                        <p>Total</p>
                        <h3>{total}</h3>
                    </div>

                    <div className="stat-card">
                        <p>Paused</p>
                        <h3>{normalizedTasks.filter(t => t.status === "Paused").length}</h3>
                    </div>

                    <div className="stat-card">
                        <p>Completed</p>
                        <h3>{completed}</h3>
                    </div>
                </div>
            </div>

            <form className="task-form" onSubmit={createTask}>
                <div className="task-input-group">
                    <input ref={taskInputRef} placeholder="Enter new task" value={title} onChange={(e) => setTitle(e.target.value)}/>
                    {role === "superadmin" && (
                        <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} required>
                            <option value="">Assign to user</option>
                            {users.map(u => (
                                <option key={u._id} value={u._id}>{u.name}</option>
                            ))}
                        </select>
                    )}
                    <button type="submit">Add Task</button>
                </div>
                
                <span className="task-context">
                    {role === "superadmin"? "Assigning to selected user": "Adding to: "}
                    {role !== "superadmin" && <b>In Progress</b>}
                </span>
            </form>
            
            <div className="dashboard-columns">
                <div className="column">
                    <h3>{activeStatus}</h3>
                    {leftTasks.length === 0 ? (
                        <p>No tasks found.</p>
                    ) : (
                        leftTasks.map(task => (
                        <div key={task._id} className="task-card">
                            <p>{task.title}</p>
                            
                            <div className="task-actions">
                                {task.status !== "In Progress" && (
                                    <button onClick={() => updateStatus(task._id, "In Progress")}>In Progress</button>
                                )}
                                {task.status !== "Paused" && task.status !== "Completed" && (
                                    <button onClick={() => updateStatus(task._id, "Paused")}>Pause</button>
                                )}
                                {task.status !== "Completed" && (
                                    <button onClick={() => updateStatus(task._id, "Completed")}>Complete</button>
                                )}
                                <button onClick={() => deleteTask(task._id)}>Delete</button>
                            </div>
                        </div>
                        ))
                    )}
                </div>
                
                <div className="column">
                    <h3>All Tasks</h3>
                    {sortedAllTasks.map(task => {
                        const isMatch = search && task.title.toLowerCase().includes(search.toLowerCase());
                        return (
                        <div key={task._id} className={`task-card all-task ${task.status.replace(" ", "-").toLowerCase()} ${isMatch ? "search-match" : ""}`}>
                            <p>
                                {task.title}
                                {role === "superadmin" && task.userId?.name && (
                                    <span className="task-status">
                                        {" "}(
                                            {task.status}
                                            {role === "superadmin" && task.userId?.name? ` • ${task.userId.name}`: ""}
                                        )
                                    </span>
                                )}
                            </p>
                        </div>
                        );
                    })}
                </div>
            </div>
        </Layout>
    );
}
export default Dashboard;