var crypto = require('crypto');
var mongoose = require('mongoose'),
	User = mongoose.model('User');
function hashpassword(password){
	return crypto.createHash('sha256').update(password).digest('base64').toString();
}
exports.signup = function(req,res){
	var user = new User({username:req.body.username});
	user.set('hashed_password',hashpassword(req.body.password));
	user.set('email',req.body.email);
	user.save(function(err){
		if(err){
			res.session.error = err;
			res.redirect('/signup');
		}else{
			req.session.user = user.id;
			req.session.username = user.username;
			req.session.msg = 'Authenticated as ' + user.username;
			res.redirect('/');
		}
	});
};
exports.login = function(req,res){
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