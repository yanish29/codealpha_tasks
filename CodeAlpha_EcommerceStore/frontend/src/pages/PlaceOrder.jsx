import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import axios from "axios";

function PlaceOrder() {
    const { cartItems, shippingAddress, clearCart } = useCart();
    const navigate = useNavigate();

    // Calculate prices
    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2);
    };

    const itemsPrice = addDecimals(
        cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    );
    const shippingPrice = addDecimals(itemsPrice > 500 ? 0 : 100); // Free shipping over 500
    const taxPrice = addDecimals(Number((0.15 * itemsPrice).toFixed(2)));
    const totalPrice = (
        Number(itemsPrice) +
        Number(shippingPrice) +
        Number(taxPrice)
    ).toFixed(2);

    const [paymentMethod, setPaymentMethod] = useState("PayPal");

    useEffect(() => {
        if (!shippingAddress.address) {
            navigate("/shipping");
        }
    }, [shippingAddress, navigate]);

    const placeOrderHandler = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/orders`,
                {
                    orderItems: cartItems,
                    shippingAddress,
                    paymentMethod,
                    itemsPrice,
                    taxPrice,
                    shippingPrice,
                    totalPrice,
                },
                config
            );

            clearCart();
            alert("Order placed successfully! You can view it in 'My Orders'.");
            navigate('/');
        } catch (error) {
            console.error("Place Order Error:", error.response?.data?.message || error.message);
            alert(`Error placing order: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div className="container">
            <h1 className="page-title">Place Order</h1>
            <div className="cart-content">
                <div className="cart-items">
                    <div className="cart-item-details" style={{padding: '1rem', backgroundColor: 'var(--surface-color)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)'}}>
                        <h2>Shipping Address</h2>
                        <p style={{ color: '#555', marginBottom: '0'}}>
                            {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
                        </p>
                    </div>

                    <div className="cart-item-details" style={{padding: '1rem', backgroundColor: 'var(--surface-color)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginTop: '1rem'}}>
                        <h2>Payment Method</h2>
                        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.5rem', border: `1px solid ${paymentMethod === 'PayPal' ? 'var(--primary-color)' : '#ddd'}`, borderRadius: '4px' }}>
                                <input 
                                    type="radio" 
                                    value="PayPal" 
                                    checked={paymentMethod === "PayPal"} 
                                    onChange={(e) => setPaymentMethod(e.target.value)} 
                                /> 
                                PayPal or Credit Card
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.5rem', border: `1px solid ${paymentMethod === 'Stripe' ? 'var(--primary-color)' : '#ddd'}`, borderRadius: '4px' }}>
                                <input 
                                    type="radio" 
                                    value="Stripe" 
                                    checked={paymentMethod === "Stripe"} 
                                    onChange={(e) => setPaymentMethod(e.target.value)} 
                                /> 
                                Stripe
                            </label>
                        </div>
                    </div>

                    <div className="cart-item-details" style={{padding: '1rem', backgroundColor: 'var(--surface-color)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)'}}>
                        <h2>Order Items</h2>
                        {cartItems.length === 0 ? (
                            <p>Your cart is empty</p>
                        ) : (
                            <div className="cart-items-list" style={{ marginTop: '1rem'}}>
                                {cartItems.map((item, index) => (
                                    <div key={index} className="cart-item" style={{marginBottom: '0.5rem'}}>
                                        <div className="cart-item-image" style={{width: '50px', height: '50px', fontSize: '1rem'}}>
                                            {item.image.startsWith('http') ? (
                                                <img src={item.image} alt={item.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                                            ) : (
                                                <span>{item.name[0]}</span>
                                            )}
                                        </div>
                                        <div className="cart-item-details">
                                            <Link to={`/product/${item._id}`}>{item.name}</Link>
                                        </div>
                                        <div>
                                            {item.qty} x ₹{item.price} = ₹{item.qty * item.price}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="cart-summary">
                    <h2>Order Summary</h2>
                    <div className="summary-row">
                        <span>Items</span>
                        <span>₹{itemsPrice}</span>
                    </div>
                    <div className="summary-row">
                        <span>Shipping</span>
                        <span>₹{shippingPrice}</span>
                    </div>
                    <div className="summary-row">
                        <span>Tax</span>
                        <span>₹{taxPrice}</span>
                    </div>
                    <div className="summary-row total">
                        <span>Total</span>
                        <span>₹{totalPrice}</span>
                    </div>
                    <button
                        className="btn btn-primary btn-block"
                        onClick={placeOrderHandler}
                        disabled={cartItems.length === 0}
                    >
                        Place Order
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PlaceOrder;
