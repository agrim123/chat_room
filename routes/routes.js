var express = require('express');
var router = express.Router();

var users = require('../app/controllers/users_controller');
var sessions = require('../app/controllers/sessions_controller');
var rooms = require('../app/controllers/rooms_controller');
var messages = require('../app/controllers/messages_controller');

var isLoggedIn = require('../app/middlewares/login_middleware');

router.get('/',isLoggedIn, function(req,res){
	res.render('index',{username:req.session.username,msg:req.session.msg});
});

router.get('/rooms', isLoggedIn, rooms.index);
router.get('/rooms/:room', isLoggedIn, rooms.show);

router.get('/signup', users.new);
router.post('/signup',users.create);
router.get('/user/profile',users.getUserProfile);

router.get('/login', sessions.new);
router.post('/login',sessions.create);
router.get('/logout', sessions.destroy);

router.get('/clean_db', messages.clean_db);

module.exports = router;

