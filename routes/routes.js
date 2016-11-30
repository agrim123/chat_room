var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var users = require('../controllers/users_controller');
var messages = require('../controllers/messages_controller');
router.get('/chat',function(req,res){
	res.render('chat');
});
router.get('/',function(req,res){
	if(req.session.user){
		res.render('index',{username:req.session.username,msg:req.session.msg});
	}else{
		req.session.msg = "Access Denied";
		res.redirect('/login');
	}
});
router.get('/login',function(req,res){
	if(req.session.user){
		res.redirect('/');
	}else{
		res.render('login',{msg:req.session.msg});
	}
});
router.get('/user',function(req,res){
	if(req.session.user){
		res.render('user',{msg:msg.session.msg});
	}else{
		req.session.msg = 'Access Denied';
		res.redirect('/');
	}
});
router.get('/signup',function(req,res){
	if(req.session.user){
		res.redirect('/');
	}else{
		res.render('signup',{msg:req.session.msg});
	}
});
router.get('/logout',function(req,res){
	req.session.destroy(function(){
		res.redirect('/login');
	});
});
router.post('/signup',users.signup);
//router.post('/user/update',users.updateUser);
//router.post('/user/delete',users.deleteUser);
router.post('/login',users.login);
router.get('/user/profile',users.getUserProfile);
//router.post('/',messages.send);

module.exports = router;

