var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var logger = require('morgan');

var app = express();

app.use(logger());
app.use(session({
	resave:true,
	saveUninitialized:true,
	secret:'zcv',
}));
app.use(bodyParser.urlencoded({extended:true}));

app.post('/like',function(req,res){
	res.json({
		code:1,
		msg:'I Don\'t Know3',
		data:{
			params:req.params,
			query:req.query,
			cookies:req.cookies,
			session:req.session,
			body:req.body,
		}
	})
})

var server = app.listen(8585, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});