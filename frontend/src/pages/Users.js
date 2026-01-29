import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Users() {
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({name: "", email: "", password: "", role: "staff",});
    const navigate = useNavigate();
    useEffect(() => {
        API.get("/auth/me").then(res => {
            if (res.data.role !== "superadmin") {
                window.location.href = "/dashboard";
            }
        }).catch(() => {
            navigate("/dashboard");
        });
    }, [navigate]);
    
    useEffect(() => {
        API.get("/auth/users").then(res => setUsers(res.data));
    }, []);
    
    const createUser = async (e) => {
        e.preventDefault();
        await API.post("/auth/create-user", form);
        alert("User created");
        setForm({ name: "", email: "", password: "", role: "staff" });
        const res = await API.get("/auth/users");
        setUsers(res.data);
    };
    return (
        <div className="users-page" style={{ padding: 30 }}>
            <h2>Users</h2>
            
            <form onSubmit={createUser}>
                <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                <input placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                    <option value="staff">Staff</option>
                    <option value="principal">Principal</option>
                    <option value="superadmin">Super Admin</option>
                </select>
                <button>Create User</button>
            </form>
            <hr />
            
            <ul>{users.map(u => (<li key={u._id}>{u.name} — {u.email} — <b>{u.role}</b></li>))}</ul>
        </div>
    );
}
export default Users;