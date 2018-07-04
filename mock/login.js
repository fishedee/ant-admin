var express = require('express');

var app = express.Router();

app.get('/islogin',function(req,res){
	if( req.session.user ){
		res.json({
			code:0,
			msg:'',
			data:req.session.user
		});
	}else{
		res.json({
			code:1,
			msg:'dos not login',
			data:null
		});
	}
});

app.post('/login',function(req,res){
	var body = req.body;
	var name = body.name;
	var password = body.password;
	console.log(name,password);
	var userInfo;
	if( name == 'admin' && password == '888888' ){
		userInfo = {
			userId:10001,
			name:'管理员',
			role:'admin'
		};
	}else if( name == 'user' && password == '123456'){
		userInfo = {
			userId:10002,
			name:'普通用户',
			role:'user'
		};
	}else{
		res.json({
			code:1,
			msg:'账号或密码错误',
			data:null,
		});
		return;
	}
	req.session.user = userInfo;
	res.json({
		code:0,
		msg:'',
		data:null
	});
})

app.post('/logout',function(req,res){
	delete req.session.user;
	res.json({
		code:0,
		msg:'',
		data:null
	});
})

module.exports = app;