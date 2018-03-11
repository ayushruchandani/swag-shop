/**
 * Created by Ayush on 3/10/2018.
 */
var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/swag-shop');

var Product = require('./model/product');
var Wishlist = require('./model/wishlist');
var Cart = require('./model/cart');
var SaleItems = require('./model/saleItems');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));


router.use(function timelog(req, res, next) {
    console.log('Time:', Date.now())
    next()
});



router.post('/product', function(req, res){
    var product = new Product();
    product.title = req.body.title;
    product.price = req.body.price;
    product.save(function (err, savedProduct) {
        if (err) {
            res.status(500).send({error:"Could not save product"});
        } else{
            res.send(savedProduct);
        }
    });
});

router.get('/product', function(req, res){
    Product.find({}, function (err, products) {
        if (err){
            res.status(500).send({error: "Could not fetch error"});
        }
        else{
            res.send(products);
        }
    });
});

router.get('/cart', function(req, res){
    Cart.find({}).populate({path:'products', model: 'Product'}).exec(function(err, cart){
        if(err){
            res.status(500).send({error:"Could not fetch the cart"});
        } else{
            res.send(cart);
        }
    });
});

router.post('/cart', function(req, res){
    var cart = new Cart();
    cart.save(function (err, newCart) {
       if(err){
           res.status(500).send({error: "Could not create a cart"});
       }
       else{
           res.send(newCart);
       }
    });
});

router.put('/cart/product/add', function(req, res){
    Product.findOne({_id: req.body.productId}, function (err, product) {
        if(err){
            res.status(500).send({error:"Could not add item to the cart"});
        } else {
            Cart.update({_id: req.body.cartId}, {$addToSet:{products:product._id}}, function (err, cart) {
               if (err){
                   res.status(500).send({error: "Could not add items to the cart"});
               }
               else{
                   res.send("Successfully added to the cart");
               }
            });
        }
    });
});

router.delete('/cart/product/remove', function (req, res) {
    Product.findOne({_id: req.body.productId}, function (err, product) {
        if(err){
            res.status(500).send({error:"Could not remove items from the cart"});
        } else {
            Cart.update({_id: req.body.cartId}, {$pull:{products:product._id}}, function (err, cart) {
                if (err){
                    res.status(500).send({error: "Could not remove items from the cart"});
                }
                else{
                    res.send("Successfully removed from the cart");
                }
            });
        }
    });
});


router.get('/sale-items', function (req, res) {
    SaleItems.find({}).populate({path: 'products', model: 'Product'}).populate({path:'relatedItems', model: 'Product'}).exec(function (err, saleItems){
        if(err){
            res.status(500).send({error: "Could not fetch the sale items"});
        }
        else{
            res.send(saleItems);
        }
    });
});


router.post('/sale-items', function (req, res) {
    var saleItems = new SaleItems();

    saleItems.save(function (err, newSaleItems) {
        if(err){
            res.status(500).send({error:"Could not create sale items"});
        }
        else{
            res.send(newSaleItems);
        }
    });
});

router.put('/sale-items/product/add', function (req, res) {
    Product.findOne({_id: req.body.productId}, function (err, product) {
       if(err){
           res.status(500).send({error: "Could not add product to sale items"});
       } else{
           SaleItems.update({_id: req.body.saleItemsId}, {$addToSet: {products:product._id}}, function(err, saleItems){
              if(err){
                  res.status(500).send({error: "Could not add product to the sale items"});
              }
              else{
                  res.send("Successfully added product to the sale items");
              }
           });
       }
    });
});

router.delete('/sale-items/product/remove', function(req, res){
    Product.findOne({_id: req.body.productId}, function (err, product) {
        if(err){
            res.status(500).send({error: "Could not remove product from sale items"});
        } else{
            SaleItems.update({_id: req.body.saleItemsId}, {$pull: {products:product._id}}, function(err, saleItems){
                if(err){
                    res.status(500).send({error: "Could not remove product from the sale items"});
                }
                else{
                    res.send("Successfully removed product from the sale items");
                }
            });
        }
    });
});


router.put('/sale-items/related-items/add', function (req, res) {
    Product.findOne({_id: req.body.productId}, function (err, product) {
        if(err){
            res.status(500).send({error: "Could not add related items to sale items"});
        }
        else{
            SaleItems.update({_id:req.body.saleItemsId}, {$addToSet: {relatedItems: product._id}}, function(err, saleItems){
               if(err){
                   res.status(500).send({error: "Could not add related items to sale items"});
               }
               else{
                   res.send("Successfully added related items to sale items");
               }
            });
        }
    });
});

router.delete('/sale-items/related-items/remove', function (req, res) {
    Product.findOne({_id: req.body.productId}, function (err, product) {
        if(err){
            res.status(500).send({error: "Could not remove related items from sale items"});
        }
        else{
            SaleItems.update({_id:req.body.saleItemsId}, {$pull: {relatedItems: product._id}}, function(err, saleItems){
                if(err){
                    res.status(500).send({error: "Could not remove related items from sale items"});
                }
                else{
                    res.send("Successfully removed related items from sale items");
                }
            });
        }
    });
});


router.get('/wishlist', function (req, res) {
   Wishlist.find({}).populate({path: 'products', model: 'Product'}).exec(function (err, wishlists) {
       if(err){
           res.status(500).send({error: "Could not fetch wishlists"});
       } else{
           res.status(200).send(wishlists);
       }
   });
});

router.post('/wishlist', function(req, res){
   var wishlist = new Wishlist();
   wishlist.title = req.body.title;

   wishlist.save(function (err, newWishlist) {
       if(err){
           res.status(500).send({error: "Could not create wishlist"});
       }else{
           res.send(newWishlist);
       }
   })
});


router.put('/wishlist/product/add', function (req, res) {
    Product.findOne({_id: req.body.productId}, function (err, product) {
        if(err){
            res.status(500).send({error: "Could not item to wishlist"});
        }else{
            Wishlist.update({_id:req.body.wishListId}, {$addToSet:{products: product._id}}, function (err, wishlist) {
               if(err){
                   res.status(500).send({error: "Could not item to wishlist"});
               }
               else{
                   res.send(wishlist);
               }
            });
        }
    });
});

module.exports = router;