import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import API from "../services/api";
import "../styles/auth.css";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const handleSubmit = async(e) =>{
        e.preventDefault();
        try {
            await API.post("/auth/register", { name, email, password });
            alert("Registration successful. Please login.");
            navigate("/");
        }catch (err) {
            alert(err.response?.data?.message || "Registration failed");
        }
    };
    return (
    <div className="auth-container">
        <div className="auth-card">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required/>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                <button type="submit">Register</button>
            </form>
            <p>Already registered? <Link to="/">Login here</Link></p>
        </div>
    </div>
    );
}
export default Register;