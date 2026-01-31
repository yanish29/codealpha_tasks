import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const storedCart = localStorage.getItem("cartItems");
        return storedCart ? JSON.parse(storedCart) : [];
    });
    
    const [shippingAddress, setShippingAddress] = useState(() => {
        const storedAddress = localStorage.getItem("shippingAddress");
        return storedAddress ? JSON.parse(storedAddress) : {};
    });

    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);
    
    useEffect(() => {
        localStorage.setItem("shippingAddress", JSON.stringify(shippingAddress));
    }, [shippingAddress]);

    const addToCart = (product, qty = 1) => {
        const existItem = cartItems.find((x) => x._id === product._id);
        if (existItem) {
            setCartItems(
                cartItems.map((x) =>
                    x._id === existItem._id ? { ...existItem, qty: Number(qty) } : x
                )
            );
        } else {
            setCartItems([...cartItems, { ...product, qty: Number(qty) }]);
        }
    };

    const removeFromCart = (id) => {
        setCartItems(cartItems.filter((item) => item._id !== id));
    };
    
    const saveShippingAddress = (address) => {
        setShippingAddress(address);
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider value={{ cartItems, shippingAddress, addToCart, removeFromCart, saveShippingAddress, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
