var crypto = require('crypto');
var express = require('express');
var router = express.Router();

router.get('/login',function(req,res){
	if(req.session.user){
		res.redirect('/');
	}else{
		res.render('login',{msg:req.session.msg});
	}
});
module.exports = router;

