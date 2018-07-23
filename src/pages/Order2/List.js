import React,{Fragment} from 'react';
import { connect } from 'redva';
import { Button , Input , Divider,Popconfirm} from 'antd';
import MyDatePicker from '@/components/MyDatePicker';
import StandardQuery from '@/components/StandardQuery';
import StandardTable from '@/components/StandardTable';
import qs from 'qs';
import cache from '@/utils/cache';

const {MyRangePicker} = MyDatePicker;

@connect((state)=>{
	return {loading:state.loading.global};
})
export default class List extends React.Component{
	constructor(props){
		super(props);
		this.state = cache.get('/order2/list') || {
			list:[],
			where:{},
			limit:{
				pageIndex:0,
				pageSize:10,
				count:0,
			}
		}
	}
	componentDidUpdate = ()=>{
		cache.set('/order2/list',this.state);
	}
	onQueryChange = (where)=>{
		this.state.where = where;
		this.setState({});
	}
	onPaginactionChange = (limit)=>{
		this.state.limit = limit;
		this.fetch();
		this.setState({});
	}
	onQuerySubmit = ()=>{
		this.state.limit.pageIndex = 0;
		this.fetch();
	}
	componentDidMount = ()=>{
		this.fetch();
	}
	fetch = async ()=>{
		let where = { ...this.state.where };
		if( where.createTime ){
			where.beginTime = where.createTime[0]+' 00:00:00',
			where.endTime = where.createTime[1]+' 23:59:59',
			where.createTime = undefined;
		}
		let limit = { 
			...this.state.limit , 
			count:undefined
		};
		let data = await this.props.dispatch({
			type:'/order/search',
			payload:{
				...where,
				...limit,
			}
		});
		this.state.limit.count = data.count;
		this.state.list = data.data;
		this.setState({});
	}
	add = async ()=>{
		this.props.history.push({
			pathname:'/order2/detail',
			search:qs.stringify({
				hasBack:true
			})
		});
	}
	mod = async (orderId)=>{
		this.props.history.push({
			pathname:'/order2/detail',
			search:qs.stringify({
				orderId:orderId,
				hasBack:true
			})
		});
	}
	del = async (orderId)=>{
		await this.props.dispatch({
			type:'/order/del',
			payload:{
				orderId:orderId,
			}
		});
		await this.fetch();
	}
	render = ()=>{
		let queryColumns = [
			{
				title:"客户",
				dataIndex:"name",
				render:()=>{
					return (<Input placeholder="请输入"/>);
				}
			},
			{
				title:"电话",
				dataIndex:"phone",
				render:()=>{
					return (<Input placeholder="请输入"/>);
				}
			},
			{
				title:"时间",
				dataIndex:"createTime",
				render:()=>{
					return (
						<MyRangePicker/>
					);
				}
			}
		];
		 const columns = [
	      {
	        title: '订单ID',
	        dataIndex: 'orderId',
	      },
	      {
	        title: '客户',
	        dataIndex: 'name',
	      },
	      {
	        title: '电话',
	        dataIndex: 'phone',
	      },
	      {
	        title: '地址',
	        dataIndex: 'address',
	      },
	      {
	        title: '商品数量',
	        dataIndex: 'items',
	        render(val){
	        	return val.length+'个';
	        }
	      },
	      {
	        title: '总价',
	        dataIndex: 'total',
	        render(val){
	        	return val + '元';
	        }
	      },
	      {
	        title: '创建时间',
	        dataIndex: 'createTime',
	      },
	      {
	        title: '更新时间',
	        dataIndex: 'modifyTime',
	      },
	      {
	        title: '操作',
	        render: (val,data) => (
	          <Fragment>
	            <a onClick={this.mod.bind(this,data.orderId)}>修改</a>
	            <Divider type="vertical" />
	            <Popconfirm title="确定删除该订单?" onConfirm={this.del.bind(this,data.orderId)}>
	            	<a>删除</a>
	            </Popconfirm>
	          </Fragment>
	        ),
	      },
	    ];
		return (
			<div>
				<StandardQuery 
					columns={queryColumns} 
					data={this.state.where}
					onChange={this.onQueryChange}
					onSubmit={this.onQuerySubmit}/>
				<div style={{marginTop:'16px'}}>
					<Button type="primary" onClick={this.add}>添加</Button>
				</div>
				<StandardTable 
					style={{marginTop:'16px'}}
					rowKey={'orderId'}
					loading={this.props.loading}
					columns={columns}
					value={this.state.list}
					paginaction={this.state.limit}
					onPaginactionChange={this.onPaginactionChange}/>
			</div>
		);
	}
}