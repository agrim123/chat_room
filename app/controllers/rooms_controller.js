var mongoose = require('mongoose'),

Room = mongoose.model('Room');

exports.new_room = function(req,res) {
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

exports.show = function(req,res) {
	var room = req.params.room;
	res.render('room',{username:req.session.username,msg:req.session.msg,room:room});
}

exports.index = function(req,res) {
	
}