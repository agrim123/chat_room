var mongoose = require('mongoose'),
Message = mongoose.model('Message');

exports.send = function(req,res){
	var message = new Message({username:req.body.username});
	message.set('content',req.body.content);
	message.set('time',Date.now());
	message.save(function(err){
		if(err){
			console.log('error in sending');
		}else{
			console.log('send');
		}
	});
}
exports.clean_db = function(req,res) {
	Message.find({}).exec(function(err, messages) {
		if (err) throw err;
		for (var i = messages.length - 1; i >= 0; i--) {
			messages[i].remove();
		}
		res.redirect('/');
	});
}