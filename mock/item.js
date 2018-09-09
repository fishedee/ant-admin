var express = require('express');
var moment = require('moment');
var app = express.Router();

function now(){
	return moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
}

var items = [
	{itemId:10001,name:'口罩',image:"",itemCategoryId:10001,feature:[1,2],itemCategoryId2:0,createTime:now(),modifyTime:now()},
	{itemId:10002,name:'彩板大坑',image:"",itemCategoryId:10002,feature:[1],itemCategoryId2:0,createTime:now(),modifyTime:now()},
	{itemId:10003,name:'彩板波纹',image:"",itemCategoryId:10003,feature:[2],itemCategoryId2:0,createTime:now(),modifyTime:now()},
	{itemId:10004,name:'3#角铁',image:"",itemCategoryId:10004,feature:[3],itemCategoryId2:0,createTime:now(),modifyTime:now()},
	{itemId:10005,name:'4#角铁',image:"",itemCategoryId:10005,feature:[1,2,3],itemCategoryId2:0,createTime:now(),modifyTime:now()},
	{itemId:10006,name:'5#角铁',image:"",itemCategoryId:10006,feature:[],itemCategoryId2:0,createTime:now(),modifyTime:now()},
];
app.get('/search',function(req,res){
	var query = req.query;

	var result = items.filter(function(item){
		if( query.name ){
			if( item.name.indexOf(query.name) == -1 ){
				return false;
			}
		}
		if( query.itemCategoryId ){
			if( item.itemCategoryId != query.itemCategoryId 
				&& item.itemCategoryId2 != query.itemCategoryId ){
				return false;
			}
		}
		return true;
	});
	var subResult = result.slice(query.pageIndex,query.pageIndex+query.pageSize);
	res.json({
		code:0,
		msg:'',
		data:{
			data:subResult,
			count:result.length,
		}
	});
})

app.get('/get',function(req,res){
	var query = req.query;
	var itemId = query.itemId;

	var result = items.findIndex(function(item){
		if( item.itemId == itemId ){
			return true;
		}
		return false;
	});
	if( result == -1 ){
		res.json({
			code:1,
			msg:'找不到该商品',
			data:null
		});
	}else{
		res.json({
			code:0,
			msg:'',
			data:items[result]
		});
	}
})

app.post('/add',function(req,res){
	var body = req.body;

	var maxItemId = items.reduce(function(max,item){
		if( max < item.itemId ){
			return item.itemId;
		}else{
			return max;
		}
	},0);
	items.push({
		itemId:maxItemId+1,
		itemCategoryId:parseInt(body.itemCategoryId) || 0,
		itemCategoryId2:parseInt(body.itemCategoryId2) || 0,
		feature:body.feature,
		name:body.name,
		image:body.image,
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
	var itemId = body.itemId;

	var result = items.findIndex(function(item){
		if( item.itemId == itemId ){
			return true;
		}
		return false;
	});
	if( result == -1 ){
		res.json({
			code:1,
			msg:'找不到该商品',
			data:null
		});
	}else{
		var oldItem = items[result];
		items[result] = {
			itemId:itemId,
			name:body.name,
			itemCategoryId:parseInt(body.itemCategoryId) || 0,
			itemCategoryId2:parseInt(body.itemCategoryId2)||0,
			feature:body.feature,
			image:body.image,
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
	var itemId = body.itemId;
	var result = items.findIndex(function(item){
		if( item.itemId == itemId ){
			return true;
		}
		return false;
	});
	if( result == -1 ){
		res.json({
			code:1,
			msg:'找不到该商品',
			data:null
		});
	}else{
		items.splice(result,1);
		res.json({
			code:0,
			msg:'',
			data:null
		});
	}
})
module.exports = app;