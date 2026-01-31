const Order = require('../models/Order');

const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            res.status(400);
            throw new Error('No order items');
        }

        // Check stock first before creating order!
        // This prevents race conditions or ordering out of stock items
        // Also good for debugging
        for (const item of orderItems) {
            const product = await Product.findById(item._id || item.product);
            if (!product) {
                res.status(404);
                throw new Error(`Product not found: ${item.name}`);
            }
            if (product.countInStock < item.qty) {
                res.status(400);
                throw new Error(`Not enough stock for ${item.name}`);
            }
        }

        const order = new Order({
            orderItems: orderItems.map((x) => ({
                ...x,
                product: x._id || x.product,
                _id: undefined // Check if removing _id helps avoid collision if any
            })),
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });

        // Decrement stock
        for (const item of orderItems) {
            const product = await Product.findById(item._id || item.product);
            if (product) {
                product.countInStock = product.countInStock - item.qty;
                await product.save();
            }
        }

        const createdOrder = await order.save();

        res.status(201).json(createdOrder);
    } catch (error) {
        console.error("Order Controller Error:", error);
        res.status(500).json({ message: error.message, stack: error.stack });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
        'user',
        'name email'
    );

    if (order) {
        res.json(order);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
};

module.exports = {
    addOrderItems,
    getMyOrders,
    getOrderById,
};
