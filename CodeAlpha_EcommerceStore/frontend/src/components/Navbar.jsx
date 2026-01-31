import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const { cartItems } = useCart();
    const navigate = useNavigate();
    
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="container navbar-container">
                <Link to="/" className="logo">
                    Shop<span className="accent">Sphere</span>
                </Link>
                <div className="nav-links">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/cart" className="nav-link cart-link">
                        Cart 
                        {cartItems.length > 0 && <span className="cart-badge">{cartItems.length}</span>}
                    </Link>
                    
                    {userInfo ? (
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <span style={{ fontWeight: '600' }}>Hi, {userInfo.name}</span>
                            <Link to="/myorders" className="nav-link" style={{fontSize: '0.9rem'}}>My Orders</Link>
                            <button onClick={logoutHandler} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>Logout</button>
                        </div>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-outline">Login</Link>
                            <Link to="/register" className="btn btn-primary">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
