import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";

function Cart() {
    const { cartItems, removeFromCart, addToCart } = useCart();
    const navigate = useNavigate();

    const total = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

    const checkoutHandler = () => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (userInfo) {
            navigate('/shipping');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="cart-page">
            <h1 className="page-title">Shopping Cart</h1>
            
            {cartItems.length === 0 ? (
                <div className="empty-cart">
                    <p>Your cart is empty.</p>
                    <Link to="/" className="btn btn-primary">Continue Shopping</Link>
                </div>
            ) : (
                <div className="cart-content">
                    <div className="cart-items">
                        {cartItems.map((item) => (
                            <div key={item._id} className="cart-item" style={{display: 'grid', gridTemplateColumns: 'minmax(80px, 100px) 2fr 1fr 1fr 0.5fr', alignItems: 'center', gap: '1rem'}}>
                                <div className="cart-item-image">
                                   {item.image.startsWith('http') ? (
                                        <img src={item.image} alt={item.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                                   ) : (
                                        <span>{item.name[0]}</span>
                                   )}
                                </div>
                                <div className="cart-item-details">
                                    <h3 style={{fontSize: '1rem', margin: '0 0 0.5rem 0'}}>{item.name}</h3>
                                    <p className="item-price" style={{color: '#777'}}>₹{item.price}</p>
                                </div>
                                
                                <div className="cart-qty">
                                    <select 
                                        value={item.qty} 
                                        onChange={(e) => addToCart(item, Number(e.target.value))}
                                        style={{padding: '0.5rem'}}
                                    >
                                        {[...Array(item.countInStock).keys()].map((x) => (
                                            <option key={x + 1} value={x + 1}>
                                                {x + 1}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="cart-item-subtotal">
                                    <span style={{fontWeight: 'bold'}}>₹{(item.price * item.qty).toFixed(2)}</span>
                                </div>

                                <button 
                                    onClick={() => removeFromCart(item._id)}
                                    className="btn btn-outline btn-sm"
                                    style={{border: 'none', color: 'red'}}
                                >
                                    <i className="fas fa-trash"></i> X
                                </button>
                            </div>
                        ))}
                    </div>
                    
                    <div className="cart-summary">
                        <h2>Order Summary ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)</h2>
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>
                        <button 
                            className="btn btn-primary btn-block"
                            onClick={checkoutHandler}
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cart;
