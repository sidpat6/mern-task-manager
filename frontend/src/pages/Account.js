import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";

function Account() {
    const [user, setUser] = useState(null);
    const [dob, setDob] = useState("");
    const [phone, setPhone] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    useEffect(() => {
        API.get("/auth/me").then(res => {
        setUser(res.data);
        setDob(res.data.dob ? res.data.dob.split("T")[0] : "");
        setPhone(res.data.phone || "");
        });
    }, []);

    const updateProfile = async (e) => {
        e.preventDefault();
        try {
            await API.put("/auth/update-profile", { dob, phone });
            const res = await API.get("/auth/me");
            setUser(res.data);
            alert("Profile updated successfully");
        } catch (err) {
            console.error(err);
            alert("Failed to update profile");
        }
    };

    const changePassword = async (e) => {
        e.preventDefault();
        await API.put("/auth/change-password", {oldPassword,newPassword});
        alert("Password updated");
        setOldPassword("");
        setNewPassword("");
    };

    return (
        <div className="dashboard-layout">

            <Sidebar />
            <div className="dashboard-main">
                <div className="dashboard-header">
                    <h2>My Account</h2>
                </div>
                
                <div className="account-container" style={{ maxWidth: "600px" }}>
                    <p><b>Name:</b> {user?.name}</p>
                    <p><b>Email:</b> {user?.email}</p>
                    {user?.dob && (
                        <p><b>DOB:</b>{" "}{new Date(user.dob).toLocaleDateString("en-IN")}</p>
                    )}
                    {user?.phone && (
                        <p><b>Phone:</b> {user.phone}</p>
                    )}
                    
                    <hr style={{ margin: "20px 0" }} />
                    
                    <h3>Update Profile</h3>
                    <form onSubmit={updateProfile} className="task-form">
                        <input type="date" value={dob} onChange={(e) => setDob(e.target.value)}/>
                        <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)}/>
                        <button type="submit">Save Profile</button>
                    </form>
                    
                    <hr style={{ margin: "20px 0" }} />
                    
                    <h3>Change Password</h3>
                    <form onSubmit={changePassword} className="task-form">
                        <input type="password" placeholder="Old Password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)}/>
                        <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>
                        <button type="submit">Update Password</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
export default Account;