import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem("userInfo"));
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders/myorders`, config);
                setOrders(data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div className="container">
            <h1 className="page-title">My Orders</h1>
            {loading ? (
                <div className="loading-container"><div className="spinner"></div></div>
            ) : orders.length === 0 ? (
                <div className="empty-cart">
                    <p>You have no orders yet.</p>
                    <Link to="/" className="btn btn-primary">Start Shopping</Link>
                </div>
            ) : (
                <div className="orders-list">
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f4f4f4', textAlign: 'left' }}>
                                <th style={{ padding: '10px' }}>DATE</th>
                                <th style={{ padding: '10px' }}>TOTAL</th>
                                <th style={{ padding: '10px' }}>PAID</th>
                                <th style={{ padding: '10px' }}>DELIVERED</th>
                                <th style={{ padding: '10px' }}>DETAILS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id} style={{ borderBottom: '1px solid #ddd' }}>
                                    <td style={{ padding: '10px' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td style={{ padding: '10px' }}>₹{order.totalPrice}</td>
                                    <td style={{ padding: '10px' }}>
                                        {order.isPaid ? (
                                            <span style={{ color: 'green' }}>Paid</span>
                                        ) : (
                                            <span style={{ color: 'red' }}>Not Paid</span>
                                        )}
                                    </td>
                                    <td style={{ padding: '10px' }}>
                                        {order.isDelivered ? (
                                            <span style={{ color: 'green' }}>Delivered</span>
                                        ) : (
                                            <span style={{ color: 'red' }}>Not Delivered</span>
                                        )}
                                    </td>
                                    <td style={{ padding: '10px' }}>
                                        <Link to={`/order/${order._id}`} className="btn btn-sm btn-outline">
                                            Details
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default MyOrders;
