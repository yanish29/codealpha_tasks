import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

function Order() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem("userInfo"));
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                
                const { data } = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/orders/${id}`,
                    config
                );
                
                setOrder(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setError(error.response && error.response.data.message ? error.response.data.message : error.message);
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    if (loading) {
        return (
             <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }
    
    if (error) {
        return <div className="container"><p className="error-message">Error: {error}</p></div>
    }

    return (
        <div className="container" style={{ padding: '2rem 0'}}>
            <h1 className="page-title">Order Details</h1>
            <div className="cart-content">
                 <div className="cart-items">
                    <div className="cart-item-details" style={{padding: '1.5rem', backgroundColor: 'var(--surface-color)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1rem'}}>
                        <h2>Shipping</h2>
                        <p><strong>Name: </strong> {order.user.name}</p>
                        <p><strong>Email: </strong> <a href={`mailto:${order.user.email}`}>{order.user.email}</a></p>
                        <p>
                            <strong>Address: </strong>
                            {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                            {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                        </p>
                        {order.isDelivered ? (
                            <div className="status-badge in-stock" style={{display: 'inline-block', marginTop: '0.5rem'}}>Delivered on {order.deliveredAt}</div>
                        ) : (
                             <div className="status-badge out-of-stock" style={{display: 'inline-block', marginTop: '0.5rem'}}>Not Delivered</div>
                        )}
                    </div>
                    
                    <div className="cart-item-details" style={{padding: '1.5rem', backgroundColor: 'var(--surface-color)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1rem'}}>
                         <h2>Payment Method</h2>
                         <p>
                            <strong>Method: </strong>
                            {order.paymentMethod}
                        </p>
                        {order.isPaid ? (
                            <div className="status-badge in-stock" style={{display: 'inline-block', marginTop: '0.5rem'}}>Paid on {order.paidAt}</div>
                        ) : (
                             <div className="status-badge out-of-stock" style={{display: 'inline-block', marginTop: '0.5rem'}}>Not Paid</div>
                        )}
                    </div>

                    <div className="cart-item-details" style={{padding: '1rem', backgroundColor: 'var(--surface-color)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)'}}>
                        <h2>Order Items</h2>
                        {order.orderItems.length === 0 ? (
                            <p>Order is empty</p>
                        ) : (
                            <div className="cart-items-list" style={{ marginTop: '1rem'}}>
                                {order.orderItems.map((item, index) => (
                                    <div key={index} className="cart-item" style={{marginBottom: '0.5rem'}}>
                                        <div className="cart-item-image" style={{width: '50px', height: '50px', fontSize: '1rem'}}>
                                            {item.hasOwnProperty('image') && item.image && item.image.startsWith('http') ? (
                                                <img src={item.image} alt={item.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                                            ) : (
                                                <span>{item.name[0]}</span>
                                            )}
                                        </div>
                                        <div className="cart-item-details">
                                            <Link to={`/product/${item.product}`}>{item.name}</Link>
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
                        <span>₹{order.itemsPrice ? order.itemsPrice : order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                        <span>Shipping</span>
                        <span>₹{order.shippingPrice}</span>
                    </div>
                    <div className="summary-row">
                        <span>Tax</span>
                        <span>₹{order.taxPrice}</span>
                    </div>
                    <div className="summary-row total">
                        <span>Total</span>
                        <span>₹{order.totalPrice}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Order;
