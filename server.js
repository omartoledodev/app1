
var express = require('express'),
	swig = require('swig');

var session = require('express-session');//session
var RedisStore = require('connect-redis')(session);

var server = express();

var morgan = require('morgan');//logger
var bodyParser = require('body-parser')

//configurar para rendear vistas
server.engine('html', swig.renderFile);
server.set('view engine', 'html');
server.set('views', './website/views');

//Agregamos post, cookies, sesiones
/*server.configure(function() {
	server.use(express.logger());
	server.use(express.cookieParser());
	//server.use(express.bodyParser());

	server.use(express.session({
		store : new RedisStore({}),
		secret : "lolcatz"
		//store : new RedisStore({
		//host : conf.redis.host,
		//port : conf.redis.port,
		//user : conf.redis.user,
		//pass : conf.redis.pass	
		//});
	}));

});*/

server.use(session({
	secret : 'lolcatz',
	store : new RedisStore({}),
	resave : false,
	saveUninitialized : true
}))

var instLoggedIn = function (req, res, next) {
	if(!req.sess.user){
		res.redirect('/');
		return;
	}

	next();
};

var inLoggedIn = function (req, res, next) {
	if(req.sess.user){
		res.redirect('/app');
		return;
	}

	next();
};
//ruta home
server.get('/', function (req, res) {
	res.render('home');
});

//nueva ruta ./app
server.get('/app', function (req, res) { 
	//var sess = req.session; 
	res.render('app', {user : req.session.user});
});
//ruta 
server.post('/log-in', function (req, res) {
	//var sess = req.session;
	req.session.user = req.body.username;

	res.redirect('/app');
});

server.listen(3000);