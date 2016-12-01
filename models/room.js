var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
var RoomSchema = new Schema({
	creator: {type:String,required:true},
	title :{type:String,required:true,unique:true},
	created : {type:Date,required:true}
});

module.exports = mongoose.model('Room', RoomSchema);
