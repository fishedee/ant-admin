import React,{Fragment} from 'react';
import { connect } from 'redva';
import { Button , Input ,InputNumber,Divider,Popconfirm} from 'antd';
import MySelect from '@/components/MySelect';
import MyDatePicker from '@/components/MyDatePicker';
import MyTimePicker from '@/components/MyTimePicker';
import StandardQuery from '@/components/StandardQuery';
import StandardTable from '@/components/StandardTable';
import qs from 'qs';
import cache from '@/utils/cache';

const {MyRangePicker,MyWeekPicker,MyMonthPicker} = MyDatePicker;
const typeOption = {
	0:'未分类',
	1:'储蓄卡',
	2:'信用卡'
};

@connect((state)=>{
	return {loading:state.loading.global};
})
export default class Table extends React.Component{
	constructor(props){
		super(props);
		this.state = cache.get('/card2/list') || {
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
		cache.set('/card2/list',this.state);
	}
	onQueryChange = (where)=>{
		this.state.where = where;
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
			type:'/card/search',
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
			pathname:'/card2/detail',
			search:qs.stringify({
				hasBack:true
			})
		});
	}
	mod = async (cardId)=>{
		this.props.history.push({
			pathname:'/card2/detail',
			search:qs.stringify({
				cardId:cardId,
				hasBack:true
			})
		});
	}
	del = async (cardId)=>{
		await this.props.dispatch({
			type:'/card/del',
			payload:{
				cardId:cardId,
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
			},
			{
				title:"类型",
				dataIndex:"type",
				render:()=>{
					return (<MySelect options={typeOption}/>);
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
	        title: '银行卡ID',
	        dataIndex: 'cardId',
	      },
	      {
	        title: '名称',
	        dataIndex: 'name',
	      },
	      {
	        title: '类型',
	        dataIndex: 'type',
	        render: (val) =>typeOption[val],
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
	            <a onClick={this.mod.bind(this,data.cardId)}>修改</a>
	            <Divider type="vertical" />
	            <Popconfirm title="确定删除该银行卡?" onConfirm={this.del.bind(this,data.cardId)}>
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
					onChange={this.onQueryChange}/>
				<div style={{marginTop:'16px'}}>
					<Button type="primary" onClick={this.add}>添加</Button>
				</div>
				<StandardTable 
					style={{marginTop:'16px'}}
					rowKey={'cardId'}
					loading={this.props.loading}
					columns={columns}
					value={this.state.list}
					paginaction={this.state.limit}
					onPaginactionChange={this.onPaginactionChange}/>
			</div>
		);
	}
}