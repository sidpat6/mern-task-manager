import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

function Navbar({user, onNewTask, search, setSearch}) {
    const [open, setOpen] = useState(false);
    const closeTimer = useRef(null);
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <div className="navbar">
            <input className="nav-search" placeholder="Search tasks..." value={search} onChange={(e) => setSearch(e.target.value)}/>
            <button className="new-task-btn nav-center-btn" onClick={onNewTask}>+ New Task</button>
            
            <div className="profile-wrapper" onMouseEnter={() => {
                if (closeTimer.current) {
                    clearTimeout(closeTimer.current);
                }
                setOpen(true);
            }}
            onMouseLeave={() => {
                closeTimer.current = setTimeout(() => {
                    setOpen(false);
                }, 400);
            }}>
                
                <div className="profile">
                    <span className="avatar">{user?.name?.charAt(0).toUpperCase()}</span>
                    <span>{user?.name}</span>
                </div>
                
                {open && (
                    <div className="dropdown">
                        <p className="role-text">Role: {user?.role}</p>
                        <button onClick={() => navigate("/account")}>My Account</button>
                        <button onClick={logout}>Logout</button>
                    </div>
                )}
            </div>
        </div>
    );
}
export default Navbar;