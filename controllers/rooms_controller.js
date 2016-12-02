var mongoose = require('mongoose'),
Room = mongoose.model('Room');
exports.new_room = function(req,res){
	var room = new Room({creator:req.body.username});
	room.set('title',req.body.content);
	room.set('created',Date.now());
	room.save(function(err){
		if(err){
			console.log('error in forming');
		}else{
			console.log('send');
		}
	});
}