var express = require('express');
var multiparty = require('multiparty');
var crypto = require('crypto');
var fs = require('fs');
var path = require('path');
var app = express.Router();

var dataDir = path.resolve(__dirname+'/../data/');
app.get('/image/:name',function(req,res){
	var name = req.params.name;
	try{
		var buffer = fs.readFileSync(dataDir+'/'+name);
		res.header('content-type','image/jpeg');
		res.send(buffer);
	}catch(e){
		res.status(404).json({
			code:1,
			msg:'找不到此文件'
		}).end();
	}
})

app.post('/image',function(req,res){
	var form = new multiparty.Form();
	form.parse(req,function(err,fields,files){
		if( err ){
			res.json({
				code:1,
				msg:err,
				data:null
			});
			return;
		}
		var files = files['data'];
		if( !files ){
			res.json({
				code:1,
				msg:'缺少data参数',
				data:null
			});
			return;
		}
		var file = files[0];
		var buffer = fs.readFileSync(file.path);
		var fsHash = crypto.createHash('md5');
		fsHash.update(buffer);
		var md5 = fsHash.digest('hex');
		fs.writeFileSync(dataDir+'/'+md5,buffer);
		res.json({
			code:0,
			msg:'',
			data:'/upload/image/'+md5,
		});
		return;
	});
});

module.exports = app;