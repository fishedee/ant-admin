var express = require('express');
var moment = require('moment');
var app = express.Router();

function now(){
	return moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
}

var itemCategorys = [
	{itemCategoryId:10001,name:'电器',parent:0,createTime:now(),modifyTime:now()},
	{itemCategoryId:10002,name:'衣服',parent:0,createTime:now(),modifyTime:now()},
	{itemCategoryId:10003,name:'家具',parent:0,createTime:now(),modifyTime:now()},
	{itemCategoryId:10004,name:'百货',parent:0,createTime:now(),modifyTime:now()},
	{itemCategoryId:10005,name:'玩具',parent:0,createTime:now(),modifyTime:now()},
	{itemCategoryId:10006,name:'电视机',parent:10001,createTime:now(),modifyTime:now()},
	{itemCategoryId:10007,name:'洗衣机',parent:10001,createTime:now(),modifyTime:now()},
	{itemCategoryId:10008,name:'衬衫',parent:10002,createTime:now(),modifyTime:now()},
	{itemCategoryId:10009,name:'短裤',parent:10002,createTime:now(),modifyTime:now()},
	{itemCategoryId:10010,name:'凳子',parent:10003,createTime:now(),modifyTime:now()},
	{itemCategoryId:10011,name:'桌子',parent:10003,createTime:now(),modifyTime:now()},
	{itemCategoryId:10012,name:'水桶',parent:10004,createTime:now(),modifyTime:now()},
	{itemCategoryId:10013,name:'脸盘',parent:10004,createTime:now(),modifyTime:now()},
];
app.get('/getAll',function(req,res){
	res.json({
		code:0,
		msg:'',
		data:itemCategorys
	});
})

app.get('/get',function(req,res){
	var query = req.query;
	var itemCategoryId = query.itemCategoryId;

	var result = itemCategorys.findIndex(function(item){
		if( item.itemCategoryId == itemCategoryId ){
			return true;
		}
		return false;
	});
	if( result == -1 ){
		res.json({
			code:1,
			msg:'找不到该类别',
			data:null
		});
	}else{
		res.json({
			code:0,
			msg:'',
			data:itemCategorys[result]
		});
	}
})

app.post('/add',function(req,res){
	var body = req.body;

	var maxItemCategoryId = itemCategorys.reduce(function(max,item){
		if( max < item.itemCategoryId ){
			return item.itemCategoryId;
		}else{
			return max;
		}
	},0);
	itemCategorys.push({
		itemCategoryId:maxItemCategoryId+1,
		parent:parseInt(body.parent),
		name:body.name,
		createTime:now(),
		modifyTime:now()
	});
	res.json({
		code:0,
		msg:'',
		data:null
	});
})

app.post('/mod',function(req,res){
	var body = req.body;
	var itemCategoryId = body.itemCategoryId;

	var result = itemCategorys.findIndex(function(item){
		if( item.itemCategoryId == itemCategoryId ){
			return true;
		}
		return false;
	});
	if( result == -1 ){
		res.json({
			code:1,
			msg:'找不到该类别',
			data:null
		});
	}else{
		var oldItem = itemCategorys[result];
		itemCategorys[result] = {
			itemCategoryId:itemCategoryId,
			parent:parseInt(body.parent),
			name:body.name,
			createTime:oldItem.createTime,
			modifyTime:now()
		};
		res.json({
			code:0,
			msg:'',
			data:null
		});
	}
})

app.post('/del',function(req,res){
	var body = req.body;
	var itemCategoryId = body.itemCategoryId;
	var result = itemCategorys.findIndex(function(item){
		if( item.itemCategoryId == itemCategoryId ){
			return true;
		}
		return false;
	});
	if( result == -1 ){
		res.json({
			code:1,
			msg:'找不到该类别',
			data:null
		});
	}else{
		itemCategorys.splice(result,1);
		res.json({
			code:0,
			msg:'',
			data:null
		});
	}
})
module.exports = app;