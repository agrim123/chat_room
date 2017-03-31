var mongoose = require('mongoose');
var User = mongoose.model('User');

var hashpassword = require('../helpers/users_helper');

exports.new = function(req,res) {
	if(req.session.user){
		res.redirect('/');
	}else{
		res.render('login');
	}
}

exports.create = function(req,res){
	User.findOne({username:req.body.username})
	.exec(function(err,user){
		if(!user){
			err = 'User not found';
		}else if(user.hashed_password === hashpassword(req.body.password.toString())){
			req.session.regenerate(function(){
				req.session.user = user.id;
				req.session.username = user.username;
				req.session.msg = 'Auithenticated as '+ user.username;
				res.redirect('/');
			});
		}else{
			err = 'Authentication failed';
		}
		if(err){
			req.session.regenerate(function(){
				req.session.msg = err;
				res.redirect('/');
			});
		}
	});
};

exports.destroy = function(req,res) {
	req.session.destroy(function(){
		res.redirect('/login');
	});
}
