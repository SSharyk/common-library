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