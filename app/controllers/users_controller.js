var crypto = require('crypto');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var hashpassword = require('../helpers/users_helper');

exports.create = function(req,res){
	var user = new User({username:req.body.username});
	user.set('hashed_password',hashpassword(req.body.password));
	user.set('email',req.body.email);
	user.save(function(err){
		if(err){
			res.redirect('/signup', {msg: err});
		}else{
			req.session.user = user.id;
			req.session.username = user.username;
			req.session.msg = 'Authenticated as ' + user.username;
			res.redirect('/');
		}
	});
};

exports.new = function(req,res) {
	if(req.session.user){
		res.redirect('/');
	}else{
		res.render('signup',{msg:req.session.msg});
	}
}
exports.getUserProfile = function(req,res){
	User.findOne({_id:req.session.user})
	.exec(function(err,user){
		if(!user){
			res.json(404,{err:'User not found'});
		}else{
			res.json(user);
		}
	});
};