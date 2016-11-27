var crypto = require('crypto');
var express = require('express');
var users = require('./controllers/users_controller.js');
router.get('/',function(req,res){
	res.render('index');
})
