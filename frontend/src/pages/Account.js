import API from "../services/api";
import {useEffect, useState} from "react";
import "../styles/auth.css";

function Account(){
    const [user, setUser] = useState({});
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    useEffect(()=>{
        API.get("/auth/me").then(res => setUser(res.data));
    }, []);

    const changePassword=async(e)=> {
        e.preventDefault();
        try {
            await API.put("/auth/change-password", {oldPassword, newPassword});
            alert("Password updated successfully");
            setOldPassword("");
            setNewPassword("");
        }
        catch (err) {
            alert(err.response?.data?.message || "Password update failed");
        }
    };
    
    return (
    <div className="account">
        <div className="account-card">
            <h2>My Account</h2>
            <p><b>Name:</b> {user.name}</p>
            <p><b>Email:</b> {user.email}</p>
            <hr />

            <h3>Change Password</h3>
            <form onSubmit={changePassword}>
                <input type="password" placeholder="Old Password" value={oldPassword} onChange={(e)=> setOldPassword(e.target.value)} required/>
                <input type="password" placeholder="New Password" value={newPassword} onChange={(e)=> setNewPassword(e.target.value)} required/>
                <button type="submit">Update Password</button>
            </form>
        </div>
    </div>
    );
}
export default Account;
