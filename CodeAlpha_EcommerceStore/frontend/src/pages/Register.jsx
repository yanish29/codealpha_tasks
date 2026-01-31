import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/users/register`, {
                name,
                email,
                password,
            });
            alert("Registered successfully, please login");
            navigate('/login');
        } catch (error) {
            console.error("Register Error", error);
            alert("Registration failed");
        }
    };

    return (
        <div className="auth-container">
            <h1 className="auth-title">Register</h1>
            <form onSubmit={submitHandler}>
                 <div className="form-group">
                    <label>Name</label>
                    <input
                        className="form-control"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Email Address</label>
                    <input
                        className="form-control"
                        placeholder="Enter your email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        className="form-control"
                        placeholder="Enter your password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary btn-block">Register</button>
            </form>
             <div className="auth-footer">
                Already have an account? <Link to="/login">Login</Link>
            </div>
        </div>
    );
}

export default Register;
