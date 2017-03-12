const AUTH_COOKIE_NAME = "TICKET_AUTH"
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var ticket = require('encrypted-ticket');
var Users = require('../data/user');

var router = express.Router();
router.use(bodyParser.json());

var _ticket;

router.get('/current', function(req, res, next) {
	if (req.headers.cookie.indexOf(AUTH_COOKIE_NAME) != -1 &&
		ticket.isValid(_ticket)) {
		var data = ticket.decryptData(_ticket);
		res.json({
			status: 200,
			message: "Вход произведен успешно",
			login: data["login"], 
			email: data["email"], 
			addresses: data["address"],
		});
	} else {
		res.json({
			status: 401,
			message: "Вы еще не авторизованы"
		});
	}
});

router.get('/login/:login/:password', function(req, res, next) {
	if (req.headers.cookie.indexOf(AUTH_COOKIE_NAME) != -1 &&
		ticket.isValid(_ticket)) {
		res.json({
			status: 403,
			message: "В одну реку нельзя войти дважды, и в эту систему тоже"
		});
		return;
	}
	Users.findOne({login: req.params.login, password: req.params.password}, function(err, user){
		if (err) throw err;

		if (user != null) {
			_ticket = ticket.generate(user, {store: true});
			res.cookie(AUTH_COOKIE_NAME, _ticket["signature"], { maxAge: 900000, httpOnly: true });
			res.json({
				status: 200,
				message: "Поздравляем, вход произведен успешно",
				login: user["login"], 
				email: user["email"], 
				addresses: user["address"],
				encrypted: _ticket["data"]
			});
		} else {
			res.json({
				status: 401,
				message: "Неверные данные"
			});
		}
	});
});

router.get('/logout', function(req, res, next) {
	if (req.headers.cookie.indexOf(AUTH_COOKIE_NAME) != -1 &&
		ticket.isValid(_ticket)) {
		_ticket = ticket.delete(_ticket);
		res.clearCookie(AUTH_COOKIE_NAME); 
		res.json({
			status: 200,
			message: "Вы успешно покинули систему"
		});
	} else {
		res.json({
			status: 401,
			message: "Невозвожно осуществить выход"
		});
	}
});

module.exports = router;