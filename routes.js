var express = require('express');
var router = express.Router();
var crypto = require('crypto');
module.exports = function(app){
var users = require('./controllers/users_controller');

app.get('/',function(req,res){
	if(req.session.user){
		res.render('index',{username:req.session.username,msg:req.session.msg});
	}else{
		req.session.msg = "Access Denied";
		res.redirect('/login');
	}
});
app.get('/login',function(req,res){
	if(req.session.user){
		res.redirect('/');
	}else{
		res.render('login',{msg:req.session.msg});
	}
});
app.get('/user',function(req,res){
	if(req.session.user){
		res.render('user',{msg:msg.session.msg});
	}else{
		req.session.msg = 'Access Denied';
		res.redirect('/');
	}
});
app.get('/signup',function(req,res){
	if(req.session.user){
		res.redirect('/');
	}else{
		res.render('signup',{msg:req.session.msg});
	}
});
app.get('/logout',function(req,res){
	req.session.destroy(function(){
		res.redirect('/login');
	});
});
app.post('/signup',users.signup);
app.post('/user/update',users.updateUser);
app.post('/user/delete',users.deleteUser);
app.post('/login',users.login);
app.get('/user/profile',users.getUserProfile);
}
//module.exports = router;
