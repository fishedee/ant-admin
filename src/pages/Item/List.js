import React,{Fragment} from 'react';
import { connect } from 'redva';
import { Button , Input ,Divider,Popconfirm} from 'antd';
import StandardQuery from '@/components/StandardQuery';
import StandardTable from '@/components/StandardTable';
import qs from 'qs';
import cache from '@/utils/cache';

@connect((state)=>{
	return {loading:state.loading.global};
})
export default class Table extends React.Component{
	constructor(props){
		super(props);
		this.state = cache.get('/item/list') || {
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
		cache.set('/item/list',this.state);
	}
	onQueryChange = (where)=>{
		this.state.where = where;
		this.setState({});
	}
	onQuerySubmit = ()=>{
		this.state.limit.pageIndex = 0;
		this.setState({});
		this.fetch();
	}
	onPaginactionChange = (limit)=>{
		this.state.limit = limit;
		this.fetch();
		this.setState({});
	}
	componentDidMount = ()=>{
		this.fetch();
	}
	fetch = async ()=>{
		let where = { ...this.state.where };
		let limit = { 
			...this.state.limit , 
			count:undefined
		};
		let data = await this.props.dispatch({
			type:'/item/search',
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
			pathname:'/item/detail',
			search:qs.stringify({
				hasBack:true
			})
		});
	}
	mod = async (itemId)=>{
		this.props.history.push({
			pathname:'/item/detail',
			search:qs.stringify({
				itemId:itemId,
				hasBack:true
			})
		});
	}
	del = async (itemId)=>{
		await this.props.dispatch({
			type:'/item/del',
			payload:{
				itemId:itemId,
			}
		});
		await this.fetch();
	}
	render = ()=>{
		let queryColumns = [
			{
				title:"名称",
				dataIndex:"name",
				render:()=>{
					return (<Input placeholder="请输入"/>);
				}
			}
		];
		 const columns = [
	      {
	        title: '商品ID',
	        dataIndex: 'itemId',
	      },
	      {
	        title: '名称',
	        dataIndex: 'name',
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
	            <a onClick={this.mod.bind(this,data.itemId)}>修改</a>
	            <Divider type="vertical" />
	            <Popconfirm title="确定删除该商品?" onConfirm={this.del.bind(this,data.itemId)}>
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
					rowKey={'itemId'}
					loading={this.props.loading}
					columns={columns}
					value={this.state.list}
					paginaction={this.state.limit}
					onPaginactionChange={this.onPaginactionChange}/>
			</div>
		);
	}
}