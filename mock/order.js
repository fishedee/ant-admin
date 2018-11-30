var express = require('express');
var moment = require('moment');
var app = express.Router();

function now(){
	return moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
}

var orders = [
	{
		orderId:10001,
		name:'张三',
		phone:'15018749403',
		address:'广东省深圳市',
		cardId:10001,
		items:[
			{
				itemId:10001,
				price:1,
				num:2,
				amount:2
			},
			{
				itemId:10002,
				price:2,
				num:3,
				amount:6
			}
		],
		total:8,
		createTime:now(),
		modifyTime:now()
	},
	{
		orderId:10002,
		name:'李四',
		phone:'15018749404',
		address:'广东省佛山市',
		cardId:10002,
		items:[
			{
				itemId:10003,
				price:1.1,
				num:2,
				amount:2.2
			},
			{
				itemId:10004,
				price:2,
				num:3,
				amount:6
			}
		],
		total:8.2,
		createTime:now(),
		modifyTime:now()
	},
];
app.get('/search',function(req,res){
	var query = req.query;

	var result = orders.filter(function(order){
		if( query.name ){
			if( order.name.indexOf(query.name) == -1 ){
				return false;
			}
		}
		if( query.phone ){
			if( order.phone.indexOf(query.phone) == -1 ){
				return false;
			}
		}
		if( query.beginTime && query.endTime ){
			if( order.createTime < query.beginTime ){
				return false;
			}
			if( order.createTime > query.endTime ){
				return false;
			}
		}
		if( query.itemIds && query.itemIds.length != 0 ){
			var itemIdMap = {};
			for( var i in order.items  ){
				var single = order.items[i];
				itemIdMap[single.itemId] = true;
			}
			for( var i in query.itemIds ){
				if( !itemIdMap[query.itemIds[i]] ){
					return false
				}
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
	var orderId = query.orderId;

	var result = orders.findIndex(function(order){
		if( order.orderId == orderId ){
			return true;
		}
		return false;
	});
	if( result == -1 ){
		res.json({
			code:1,
			msg:'找不到该订单',
			data:null
		});
	}else{
		res.json({
			code:0,
			msg:'',
			data:orders[result]
		});
	}
})

app.post('/add',function(req,res){
	var body = req.body;

	var maxOrderId = orders.reduce(function(max,order){
		if( max < order.orderId ){
			return order.orderId;
		}else{
			return max;
		}
	},0);
	orders.push({
		orderId:maxOrderId+1,
		name:body.name,
		cardId:body.cardId,
		phone:body.phone,
		address:body.address,
		items:body.items.map((item)=>{
			return {
				...item,
				itemId:parseInt(item.itemId),
			}
		}),
		total:body.total,
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
	var orderId = body.orderId;

	var result = orders.findIndex(function(order){
		if( order.orderId == orderId ){
			return true;
		}
		return false;
	});
	if( result == -1 ){
		res.json({
			code:1,
			msg:'找不到该订单',
			data:null
		});
	}else{
		var oldOrder = orders[result];
		orders[result] = {
			orderId:orderId,
			name:body.name,
			cardId:body.cardId,
			phone:body.phone,
			address:body.address,
			items:body.items.map((item)=>{
				return {
					...item,
					itemId:parseInt(item.itemId),
				}
			}),
			total:body.total,
			createTime:oldOrder.createTime,
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
	var orderId = body.orderId;
	var result = orders.findIndex(function(order){
		if( order.orderId == orderId ){
			return true;
		}
		return false;
	});
	if( result == -1 ){
		res.json({
			code:1,
			msg:'找不到该订单',
			data:null
		});
	}else{
		orders.splice(result,1);
		res.json({
			code:0,
			msg:'',
			data:null
		});
	}
})
module.exports = app;