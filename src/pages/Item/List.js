import React,{Fragment} from 'react';
import { connect } from 'redva';
import { Button , Input ,Divider,Popconfirm,Row,Col} from 'antd';
import MyTreeList from '@/components/MyTreeList';
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
			},
			allCategorys:{},
		}
	}
	componentDidUpdate = ()=>{
		cache.set('/item/list',this.state);
	}
	onTreeChange = (id)=>{
		this.state.where.itemCategoryId = id;
		this.setState({});
		this.fetch();
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
		let allCategorys = await this.props.dispatch({
			type:'/itemcategory/getAll'
		});
		this.state.allCategorys = {
			0:{itemCategoryId:0,name:'无分组'},
			...allCategorys,
		};

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
				itemCategoryId:this.state.where.itemCategoryId,
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
	        title: '类别',
	        dataIndex: 'itemCategoryId',
	        render:(value)=>{
	        	return this.state.allCategorys[value].name;
	        }
	      },
	      {
	        title: '次类别',
	        dataIndex: 'itemCategoryId2',
	        render:(value)=>{
	        	return this.state.allCategorys[value].name;
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
			<Row gutter={16}>
				<Col span={8}>
					<MyTreeList
						value={this.state.where.itemCategoryId}
						onChange={this.onTreeChange}
						nodes={this.state.allCategorys}
						renderNode={(data)=>('['+data.itemCategoryId+']'+data.name)}/>
				</Col>
				<Col span={16}>
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
				</Col>
			</Row>
		);
	}
}