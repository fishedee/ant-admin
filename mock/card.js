var express = require('express');
var moment = require('moment');
var app = express.Router();

function now(){
	return moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
}

var cards = [
	{cardId:10001,name:'工资卡',type:1,createTime:now(),modifyTime:now()},
	{cardId:10002,name:'投资卡',type:1,createTime:now(),modifyTime:now()},
	{cardId:10003,name:'零用卡',type:2,createTime:now(),modifyTime:now()},
	{cardId:10004,name:'家用卡',type:2,createTime:now(),modifyTime:now()},
	{cardId:10005,name:'工资卡',type:1,createTime:now(),modifyTime:now()},
	{cardId:10006,name:'投资卡',type:1,createTime:now(),modifyTime:now()},
	{cardId:10007,name:'零用卡',type:2,createTime:now(),modifyTime:now()},
	{cardId:10008,name:'家用卡',type:2,createTime:now(),modifyTime:now()},
	{cardId:10011,name:'工资卡',type:1,createTime:now(),modifyTime:now()},
	{cardId:10012,name:'投资卡',type:1,createTime:now(),modifyTime:now()},
	{cardId:10013,name:'零用卡',type:2,createTime:now(),modifyTime:now()},
	{cardId:10014,name:'家用卡',type:2,createTime:now(),modifyTime:now()},
	{cardId:10015,name:'工资卡',type:1,createTime:now(),modifyTime:now()},
	{cardId:10016,name:'投资卡',type:1,createTime:now(),modifyTime:now()},
	{cardId:10017,name:'零用卡',type:2,createTime:now(),modifyTime:now()},
	{cardId:10018,name:'家用卡',type:2,createTime:now(),modifyTime:now()}
];
app.get('/search',function(req,res){
	var query = req.query;

	var result = cards.filter(function(card){
		if( query.name ){
			if( card.name.indexOf(query.name) == -1 ){
				return false;
			}
		}
		if( query.type ){
			if( card.type != query.type ){
				return false;
			}
		}
		if( query.beginTime && query.endTime ){
			if( card.createTime < query.beginTime ){
				return false;
			}
			if( card.createTime > query.endTime ){
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
	var cardId = query.cardId;

	var result = cards.findIndex(function(card){
		if( card.cardId == cardId ){
			return true;
		}
		return false;
	});
	if( result == -1 ){
		res.json({
			code:1,
			msg:'找不到该银行卡',
			data:null
		});
	}else{
		res.json({
			code:0,
			msg:'',
			data:cards[result]
		});
	}
})

app.post('/add',function(req,res){
	var body = req.body;

	var maxCardId = cards.reduce(function(max,card){
		if( max < card.cardId ){
			return card.cardId;
		}else{
			return max;
		}
	},0);
	cards.push({
		cardId:maxCardId+1,
		name:body.name,
		type:parseInt(body.type),
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
	var cardId = body.cardId;

	var result = cards.findIndex(function(card){
		if( card.cardId == cardId ){
			return true;
		}
		return false;
	});
	if( result == -1 ){
		res.json({
			code:1,
			msg:'找不到该银行卡',
			data:null
		});
	}else{
		var oldCard = cards[result];
		cards[result] = {
			cardId:cardId,
			name:body.name,
			type:parseInt(body.type),
			createTime:oldCard.createTime,
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
	var cardId = body.cardId;
	var result = cards.findIndex(function(card){
		if( card.cardId == cardId ){
			return true;
		}
		return false;
	});
	if( result == -1 ){
		res.json({
			code:1,
			msg:'找不到该银行卡',
			data:null
		});
	}else{
		cards.splice(result,1);
		res.json({
			code:0,
			msg:'',
			data:null
		});
	}
})
module.exports = app;