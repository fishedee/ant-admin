import template from 'art-template';

var tpl = `
<!doctype html>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8"/>
	<title>打印测试</title>
	<style>
		*{
			margin:0px;
			padding: 0px;
		}
		@page { 
			size:140mm 241mm;
			margin-left:10mm;
			margin-right:10mm;
			margin-top:15mm;
			margin-bottom:15mm;
		}
		#body{
			width:120mm;
			padding:25px;
			margin:0 auto;
		}
		.title{
			text-align:center;
			font-size:20px;
		}
		.header{
			overflow:hidden;
		}
		.name,.orderId,.phone,.date{
			margin-top:10px;
			float:left;
			width:50%;
			font-size:14px;
		}
		.content{
			margin-top:10px;
		}
		table{
			border-collapse: collapse;
			width:100%;
		}
		table,th,td{
			border: 1px solid black;
		}
		thead td{
			padding:2px 0px;
			font-size:12px;
		}
		tbody td{
			padding:2px 0px;
			font-size:14px;
		}
		.num{
			text-align:center;
			width:20%;
		}
		.product{
			text-align:center;
			width:20%;
		}
		.count{
			text-align:center;
			width:14%;
		}
		.price{
			text-align:center;
			width:14%;
		}
		.total{
			text-align:center;
			width:14%;
		}
		.footer{
			margin-top:10px;
			overflow: hidden;
		}
		.receiver{
			float:left;
			width:70%;
			font-size:14px;
		}
		.manager{
			float:left;
			width:30%;
			font-size:14px;
		}
		.notice{
			margin-top:40px;
			text-align: center;
			font-size:14px;
		}
		.pageCount{
			margin-top:20px;
			float:right;
			font-size:12px;
		}
	</style>
	<style media="print">
		#body{
			margin:0;
			padding:0;
		}
		#printButton{
			display:none;
		}
	</style>
</head>
<body>
	<div id="body">
		<div class="title">ant-admin销售订单</div>
		<div class="header">
			<div class="name">客户：<span><%= name %></span></div>
			<div class="orderId">销售单号：<span><%= orderId %></span></div>
			<div class="phone">客户电话：<span><%= phone %></span></div>
			<div class="date">日期：<span><%= createTime %></span></div>
		</div>
		<table class="content">
			<thead>
				<td class="num">对照号</td>
				<td class="product">商品</td>
				<td class="price">单价</td>
				<td class="count">数量</td>
				<td class="total">金额</td>
			</thead>
			<tbody>
				<% for( var i = 0 ;i != items.length ;i++ ){%>
				<tr>
					<td class="num"><%= i+1 %></td>
					<td class="product"><%= itemMap[items[i].itemId].name %></td>
					<td class="price"><%= items[i].price %></td>
					<td class="count"><%= items[i].num %></td>
					<td class="total"><%= items[i].amount %></td>
				</tr>
				<%}%>
				<tr class="allTotal">
					<td class="allTotalNumber" colspan="5">&nbsp;合计金额：<%= total %></td>
				</tr>
			</tbody>
		</table>
		<div class="footer">
			<div class="receiver">收货人：<span></span></div>
			<div class="manager">经手人：<span></span></div>
			<div class="notice">注：签名作为未付款凭证，货物出门，恕不退换！</div>
			<div class="pageCount">第1页/共1页</div>
		</div>
	</div>
</body>
</html>
`

var render = template.compile(tpl)

export default function DetailPrint(data){
	return render(data);
}