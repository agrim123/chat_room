var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var mongoStore = require('connect-mongo')({session:expressSession});
var fs = require("fs");
var mongoose = require('mongoose');
require('./models/user.js');
require('dotenv').config();
var Message = require('./models/message');
var Room = require('./models/room');
var routes = require('./routes/routes');

var app = express();
mongoose.Promise = global.Promise;
var db = mongoose.connect(process.env.MONGODB_URI, { server: { auto_reconnect: true } }, function (err, db) {
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(expressSession({
    secret:'SECRET',
    resave:true,
    saveUninitialized:false,
    cookie:{maxAge:60*60*1000},
    store: new mongoStore({
        mongooseConnection: db.connection,
        collection: "sessions"
    }) 
}));
app.use('/', routes);
//app.use('/users', users);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
//module.exports = app;
var io = require('socket.io').listen(app.listen(process.env.PORT));
io.sockets.on('connection', function(socket){
    socket.on("rooms",function(){
        Room.find({}).exec(function(err,rooms){
            if(err) throw err;
            io.emit('rooms',rooms);
        });
    });
    socket.on('add_room',function(new_room_name,username){
        //Room.remove({title:"node"});
        var new_room = {creator:username,title:new_room_name,created:Date.now()};
        Room.find({title:new_room_name}).exec(function(err,room){
            if(room.length != 0){
                io.emit('add_room',"Room already exists");
            }else{
                var room = new Room(new_room);
                room.save(function(err){
                   if(err){
                    console.log(err);
                    io.emit('add_room', "error creating room");
                }else{
                    io.emit('add_room', new_room);
                }
            });
            }
        });
    });
    socket.on('chat_data',function(room){
        Message.find({room:room}).limit(10).sort({'created': -1}).exec(function(err, messages) {
          if (err) throw err;
          io.emit('chat_data',messages);
      });
    });
    socket.on('name',function(name,room){
        io.emit("join_room",name,room);
        socket.on('chat message', function(message){
           var messagedata = {username:message.fromuser,content:message.content,created:Date.now(),room:message.room};
           Room.find({title:messagedata.room}).exec(function(err,room){
            if(room.length == 0){

                io.emit('chat message', "Room does not exist! Create One ");
            }else{
               var message = new Message(messagedata);
               message.save(function(err){
                if(err){
                    console.log(err);
                    io.emit('chat message', "error sending message");
                }else{
                    io.emit('chat message', messagedata);
                }
            });
           }
       });
       });
        socket.on('notifyUser', function(useristyping){
            io.emit('notifyUser', useristyping);
        });
        socket.on('disconnect', function () {
            io.emit("leave_room",name,room);
        });
    });
});




