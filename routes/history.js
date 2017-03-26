var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var History = require('../data/history');
var Users = require('../data/user');
var Books = require('../data/book');
var Comments = require('../data/comment');
var Messages = require('../data/message');

var router = express.Router();
router.use(bodyParser.json());

router.get('/get', function(req, res, next){
    let from = req.query.from;
    let id = req.query.id;

    History.find({fromUserLogin: from, bookId: id}, function(err, h){
        if (err) throw err;
        res.json(h);
    })
});

router.get('/ofUser/:userLogin', function(req, res, next) {
    let userLogin = req.params.userLogin;
    let result = [];
    History.find({fromUserLogin: userLogin}, function(err, hItems1) {
        if (err) throw err;
        result = hItems1;

        History.find({toUserLogin: userLogin}, function(err, hItems2) {
            if (err) throw err;
            if (hItems2.length == 0) {
                res.json(result);
            } else {
                for (var i=0; i<hItems2.length; i++) {
                    result.push(hItems2[i]);
                    if (i == hItems2.length - 1) {
                        res.json(result);
                    }
                } 
            }
        });
    });
})

router.get('/transfer', function(req, res, next) {
    let from = req.query.from;
    let to = req.query.to;
    let id = req.query.id;

    let historyItem = {
        fromUserLogin: req.query.from,
        toUserLogin: req.query.to,
        bookId: req.query.id,
        status: req.query.status
    };
    History.create(historyItem, function(err, hist) {
        if (err) throw err;
        res.json(hist);
    });
});

module.exports = router;