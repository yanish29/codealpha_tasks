import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";


function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/users/login`,
                { email, password },
            );
            localStorage.setItem("userInfo", JSON.stringify(data));
            // Redirect or show success
            navigate('/');
        } catch (error) {
            console.error("Login Error", error);
            alert("Invalid credentials");
        }
    };

    return (
        <div className="auth-container">
            <h1 className="auth-title">Login</h1>
            <form onSubmit={submitHandler}>
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
                <button type="submit" className="btn btn-primary btn-block">Login</button>
            </form>
            <div className="auth-footer">
                New Customer? <Link to="/register">Register</Link>
            </div>
        </div>
    );
}

export default Login;
