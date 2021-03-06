const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
        // can throw error
        // cb(new Error(), true);
    } else {
        cb(null, false);
    }
}
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

const Product = require('../models/product');

router.get('/', (req, res, next) => {
    Product
        .find()
        .select('name price _id productImage')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                products: docs.map(x => {
                    return {
                        name: x.name,
                        price: x.price,
                        id: x._id,
                        productImage: x.productImage
                    }
                })
            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: 'Nothing returned'
            });
        });
});

router.post('/', upload.single('productImage'), (req, res, next) => {
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'handling post requests',
                createdProduct: product
            });
        }).catch(error => {
            console.log(error);
            res.status(500).json({
                error: error
            });
        });
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({
                    message: 'No valid entry found'
                });
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error: error
            });
        });
});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product
        .findByIdAndDelete({ _id: id })
        .exec()
        .then(response => {
            console.log('product id:' + id + ' deleted');
            if (response) {
                res.status(200).json({
                    message: 'product id:' + id + ' deleted'
                });
            } else {
                res.status(500).json({
                    message: 'no such id present'
                });
            }
        }).catch(error => {
            console.log('Product deletion failed');
            res.status(500).json({
                message: 'product id:' + id + ' not found'
            });
        })
});

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product
        .updateOne({ _id: id }, {
            $set: {
                name: req.body.newName
            }
        })
        .exec()
        .then(response => {
            console.log('product id:' + id + ' updated');
            res.status(200).json({
                message: 'product name for id:' + id + ' is set to ' + req.body.newName
            });
        }).catch(error => {
            console.log('Product deletion failed');
            res.status(500).json({
                message: 'product id:' + id + ' not found'
            });
        })
});

module.exports = router;