var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var logger = require('morgan');

var loginRouter = require('./login');
var cardRouter = require('./card');
var itemRouter = require('./item');
var itemCategoryRouter = require('./itemcategory');
var orderRouter = require('./order');
var uploadRouter = require('./upload');
var middleware = require('./middleware');

var app = express();

app.use(express.static(__dirname+'/../dist'));
app.use(logger());
app.use(session({
	resave:true,
	saveUninitialized:true,
	secret:'zcv',
}));
app.use(bodyParser.urlencoded({extended:true}));

app.use('/login',loginRouter);
app.use('/item',middleware.checkMustLogin,itemRouter);
app.use('/itemcategory',middleware.checkMustLogin,itemCategoryRouter);
app.use('/card',middleware.checkMustLogin,cardRouter);
app.use('/order',middleware.checkMustLogin,orderRouter);
app.use('/upload',middleware.checkMustLogin,uploadRouter);

var server = app.listen(3001, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});