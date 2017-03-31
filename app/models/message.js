var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
var MessageSchema = new Schema({
	username: {type:String,required:true},
	content :{type:String,required:true},
	created : {type:Date,required:true},
	room : {type:String}
});

module.exports = mongoose.model('Message', MessageSchema);
