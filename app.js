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
var Message = require('./models/message');

var routes = require('./routes/routes');

var app = express();
if (app.get('env') === 'development') {
    var db = mongoose.connect("mongodb://localhost:27017/auth");
}else{
    var URI = process.env.MONGODB_URI;;
    var db = mongoose.connect(URI, { server: { auto_reconnect: true } }, function (err, db) {
        /* adventure! */
    });

}
var port = 3000;
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
var io = require('socket.io').listen(app.listen(process.env.PORT || port));
io.sockets.on('connection', function(socket){
    socket.on('name',function(name){
        io.emit("join_room",name);
        socket.on('chat message', function(message){
            var messagedata = {username:message.fromuser,content:message.content,created:Date.now()};
            var message = new Message(messagedata);
            message.save(function(err){
                if(err){
                    console.log(err);
                    io.emit('chat message', "error sending message");
                }else{
            //console.log('send');
            io.emit('chat message', messagedata);
        }
    });
        });
        socket.on('notifyUser', function(username){
            io.emit('notifyUser', username);
        });
        socket.on('disconnect', function () {
            io.emit("leave_room",name);
        });
    });
});
// for retrieving last messages 
/*
mongo.connect(process.env.CUSTOMCONNSTR_MONGOLAB_URI, function (err, db) {
    var collection = db.collection('chat messages')
    var stream = collection.find().sort({ _id : -1 }).limit(10).stream();
    stream.on('data', function (chat) { socket.emit('chat', chat.content); });
});*/

