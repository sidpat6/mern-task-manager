import API from "../services/api";
import "../styles/auth.css";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";

function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const fetchTasks = async()=>{
        const res = await API.get("/tasks");
        setTasks(res.data);
    };
    const createTask = async(e)=> {
        e.preventDefault();
        if (!title) return;
        await API.post("/tasks", {title});
        setTitle("");
        fetchTasks();
    };
    const markCompleted = async(id)=>{
        await API.put(`/tasks/${id}`, {status: "Completed"});
        fetchTasks();
    };
    const deleteTask = async (id)=>{
        await API.delete(`/tasks/${id}`);
        fetchTasks();
    };
    const logout = () =>{
        localStorage.removeItem("token");
        window.location.href = "/";
    };
    useEffect(()=>{
        fetchTasks();
    }, []);

    return (
    <div className="dashboard">
        <div className="dashboard-card">
            <h2>Task Manager Dashboard</h2>
            <button onClick={fetchTasks} className="refresh-btn">Refresh Tasks</button>

            <form onSubmit={createTask}>
                <input placeholder="Enter new task" value={title} onChange={(e)=> setTitle(e.target.value)}/>
                <button type="submit">Add Task</button>
            </form>
            <ul className="task-list">
                {tasks.length === 0 && <p>No tasks found</p>}
                {tasks.map((task) => (
                    <li
                    key={task._id}
                    className={`task-item ${
                        task.status==="Completed" ? "completed":""
                    }`}>
                        <span>{task.title} — <b>{task.status}</b></span>
                        
                        <div className="task-actions">
                            {task.status !== "Completed" && (
                                <button className="complete-btn" onClick={()=> markCompleted(task._id)}>Complete</button>
                            )}
                            <button className="delete-btn" onClick={()=> deleteTask(task._id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>

            <Link to="/account">My Account</Link>
            <button onClick={logout} className="logout-btn">Logout</button>
        </div>
    </div>
    );
}

export default Dashboard;



