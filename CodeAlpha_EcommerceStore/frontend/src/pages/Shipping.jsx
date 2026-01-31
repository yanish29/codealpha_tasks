import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Shipping() {
    const { shippingAddress, saveShippingAddress } = useCart();
    const [address, setAddress] = useState(shippingAddress.address || "");
    const [city, setCity] = useState(shippingAddress.city || "");
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || "");
    const [country, setCountry] = useState(shippingAddress.country || "");
    
    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        saveShippingAddress({ address, city, postalCode, country });
        navigate("/placeorder");
    };

    return (
        <div className="auth-container">
            <h1 className="auth-title">Shipping Address</h1>
            <form onSubmit={submitHandler}>
                <div className="form-group">
                    <label>Address</label>
                    <input
                        className="form-control"
                        placeholder="Enter address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>City</label>
                    <input
                        className="form-control"
                        placeholder="Enter city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Postal Code</label>
                    <input
                        className="form-control"
                        placeholder="Enter postal code"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Country</label>
                    <input
                        className="form-control"
                        placeholder="Enter country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary btn-block">Continue</button>
            </form>
        </div>
    );
}

export default Shipping;
