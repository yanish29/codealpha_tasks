import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading amazing products...</p>
            </div>
        );
    }

    return (
        <div className="home-page">
            <section className="hero">
                <div className="hero-content">
                    <h1>Welcome to ShopSphere</h1>
                    <p>Discover quality products at unbeatble prices.</p>
                    <a href="#products" className="btn btn-primary">Shop Now</a>
                </div>
            </section>

            <section id="products" className="products-section">
                <h2>Latest Arrivals</h2>
                <div className="product-grid">
                    {products.map((product) => (
                        <div key={product._id} className="product-card">
                            <Link to={`/product/${product._id}`} className="product-link">
                                <div className="product-image-placeholder">
                                    {product.image.startsWith('http') ? (
                                        <img src={product.image} alt={product.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                                    ) : (
                                        <span>{product.name[0]}</span>
                                    )}
                                </div>
                                <div className="product-info">
                                    <h3>{product.name}</h3>
                                    <p className="product-price">₹{product.price}</p>
                                    <span className="view-details">View Details &rarr;</span>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default Home;
