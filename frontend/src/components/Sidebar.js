import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

function Sidebar({ role, activeFilter, setStatusFilter }) {
    const [openTasks, setOpenTasks] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    
    const isActiveRoute = (path) => location.pathname === path;
    
    const handleStatusClick = (status) => {
        if (typeof setStatusFilter === "function") {
            setStatusFilter(status);
        } else {
            navigate("/dashboard", { state: { status } });
        }
    };

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <div className="logo">🧊</div>
                
                <div>
                    <h2>FocusHub</h2>
                    <span className="subtitle">Task Manager</span>
                </div>
            </div>
            
            <nav className="sidebar-menu">
                <Link to="/dashboard" className={`sidebar-link ${isActiveRoute("/dashboard") ? "active" : ""}`}>Dashboard</Link>
                <Link to="/account" className={`sidebar-link ${isActiveRoute("/account") ? "active" : ""}`}>Account</Link>
                
                <div className="sidebar-section">
                    <div className="sidebar-link collapsible" onClick={() => setOpenTasks(!openTasks)}>
                        Tasks <span>{openTasks ? "▾" : "▸"}</span>
                    </div>
                    {openTasks && (
                        <div className="submenu">
                            <span className={`status inprogress ${activeFilter === "In Progress" ? "active" : ""}`} onClick={() => handleStatusClick("In Progress")}>In Progress</span>
                            <span className={`status paused ${activeFilter === "Paused" ? "active" : ""}`} onClick={() => handleStatusClick("Paused")}>Paused</span>
                            <span className={`status done ${activeFilter === "Completed" ? "active" : ""}`} onClick={() => handleStatusClick("Completed")}>Completed</span>
                        </div>
                    )}
                </div>
                {role === "superadmin" && (
                    <div className="sidebar-section">
                        <Link to="/users" className="sidebar-link">User Management</Link>
                    </div>
                )}
            </nav>
            
            <button className="logout-btn" onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/";
            }}>Logout</button>
        </div>
    );
}

export default Sidebar;