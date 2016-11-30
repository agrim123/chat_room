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