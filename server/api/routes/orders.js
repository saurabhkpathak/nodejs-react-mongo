const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', (req, res, next) => {
    Order
        .find()
        .select('_id quantity product')
        .populate('product', 'name price')
        .exec()
        .then(response => {
            res.status(200).json(response);
        })
        .catch(error => {
            res.status(500).json({
                message: error
            });
        })
});

router.post('/', (req, res, next) => {
    Product
        .findById(req.body.productId)
        .exec()
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: 'No Product found'
                });
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: product._id
            });
            return order.save();
        })
        .then(order => {
            res.status(201).json({
                orderCreated: order
            });
        })
        .catch(error => {
            res.status(404).json({
                message: error
            });
        });
});

router.delete('/:orderId', (req, res, next) => {
    Order
        .deleteOne({ _id: req.params.orderId })
        .exec()
        .then(response => {
            res.status(200).json({
                message: response
            });
        })
        .catch(error => {
            res.status(500).json({
                message: error
            });
        });
});

module.exports = router;