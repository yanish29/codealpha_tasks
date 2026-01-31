import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";

function Product() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToCart, cartItems, removeFromCart } = useCart();
    
    // Find if item is in cart
    const cartItem = product && cartItems.find(x => x._id === product._id);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/products/${id}`,
                );
                setProduct(data);
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!product) return <p>Product not found</p>;

    return (
        <div className="product-details-container">
            <Link to="/" className="back-link">&larr; Back to Products</Link>
            
            <div className="product-details-grid">
                <div className="product-image-large">
                     {product.image.startsWith('http') ? (
                        <img src={product.image} alt={product.name} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
                     ) : (
                        <span className="placeholder-icon">{product.name[0]}</span>
                     )}
                </div>
                
                <div className="product-info-column">
                    <h1 className="product-title">{product.name}</h1>
                    <p className="product-price-large">₹{product.price}</p>
                    
                    <div className="product-description">
                        <h3>Description</h3>
                        <p>{product.description}</p>
                    </div>
                    
                    <div className="stock-status">
                         {/* Calculate effective stock */}
                        {(() => {
                            const inCartQty = cartItem ? cartItem.qty : 0;
                            const remainingStock = product.countInStock - inCartQty;

                            return (
                                <>
                                    <span className={`status-badge ${remainingStock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                                        {remainingStock > 0 ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                    <span className="stock-count">({remainingStock} available)</span>
                                    {inCartQty > 0 && <span style={{marginLeft: '10px', fontSize: '0.9rem', color: '#555'}}>({inCartQty} in cart)</span>}
                                </>
                            );
                        })()}
                    </div>

                    {product.countInStock > 0 && (
                        <div className="action-container" style={{ marginTop: '1rem'}}>
                            {cartItem ? (
                                <div className="qty-controls" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <button 
                                        className="btn btn-outline" 
                                        onClick={() => {
                                            const newQty = cartItem.qty - 1;
                                            if (newQty < 1) {
                                                removeFromCart(product._id);
                                            } else {
                                                addToCart(product, newQty);
                                            }
                                        }}
                                        style={{ width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                                    >
                                        -
                                    </button>
                                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{cartItem.qty}</span>
                                    <button 
                                        className="btn btn-outline" 
                                        onClick={() => {
                                            const newQty = cartItem.qty + 1;
                                            if (newQty <= product.countInStock) {
                                                addToCart(product, newQty);
                                            }
                                        }}
                                        disabled={cartItem.qty >= product.countInStock}
                                        style={{ width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                                    >
                                        +
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => addToCart(product, 1)} 
                                    className="btn btn-primary add-to-cart-btn"
                                >
                                    Add to Cart
                                </button>
                            )}
                        </div>
                    )}
                    
                    {product.countInStock === 0 && (
                        <button className="btn btn-primary btn-block" disabled>
                            Sold Out
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Product;
