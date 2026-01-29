import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "../styles/dashboard.css";

function Layout({children, user, role, onNewTask, search, setSearch, setStatusFilter, activeFilter}){
    return (
        <div className="dashboard-layout">
            <Sidebar role={role} setStatusFilter={setStatusFilter} activeFilter={activeFilter}/>
            
            <div className="dashboard-main">
                <Navbar user={user} onNewTask={onNewTask} search={search} setSearch={setSearch}/>
                {children}
            </div>
        </div>
    );
}
export default Layout;