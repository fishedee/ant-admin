var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var logger = require('morgan');

var loginRouter = require('./login');
var cardRouter = require('./card');
var orderRouter = require('./order');
var middleware = require('./middleware');

var app = express();

app.use(logger());
app.use(session({
	resave:true,
	saveUninitialized:true,
	secret:'zcv',
}));
app.use(bodyParser.urlencoded({extended:true}));

app.use('/login',loginRouter);
app.use('/card',middleware.checkMustLogin,cardRouter);
app.use('/order',middleware.checkMustLogin,orderRouter);

var server = app.listen(8585, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});