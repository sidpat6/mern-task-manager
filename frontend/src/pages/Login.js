import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/auth.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const handleSubmit = async(e)=>{
        e.preventDefault();
        try {
            localStorage.removeItem("token");
            const res = await API.post("/auth/login", {email, password});
            localStorage.setItem("token", res.data.token);
            navigate("/dashboard");
        }
        catch (err) {
            alert(err.response?.data?.message || "Login failed");
        }
    };
    return (
    <div className="login-layout">
        <div className="login-left">
            <h1>Welcome Back</h1>
            <p>Manage your tasks efficiently</p>
        </div>

        <div className="login-right">
            <div className="auth-card">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                    <button type="submit">Login</button>
                </form>
                <p>New user? <Link to="/register">Register here</Link></p>
            </div>
        </div>
    </div>
    );
}
export default Login;