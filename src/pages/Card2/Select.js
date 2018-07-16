import React,{Fragment} from 'react';
import { connect } from 'redva';
import { Input} from 'antd';
import MySelect from '@/components/MySelect';
import MyDatePicker from '@/components/MyDatePicker';
import StandardQuery from '@/components/StandardQuery';
import StandardTable from '@/components/StandardTable';
import qs from 'qs';

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
		this.state = {
			list:[],
			where:{},
			limit:{
				pageIndex:0,
				pageSize:10,
				count:0,
			}
		}
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
		this.state.limit.count = data.data.count;
		this.state.list = data.data.data;
		this.setState({});
	}
	render = ()=>{
		let queryColumns = [
			{
				title:"名称",
				dataIndex:"name",
				render:()=>{
					return (<Input placeholder="请输入" autoFocus/>);
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
	    ];
		return (
			<div>
				<StandardQuery 
					columns={queryColumns} 
					data={this.state.where}
					onChange={this.onQueryChange}/>
				<StandardTable 
					style={{marginTop:'16px'}}
					rowKey={'cardId'}
					loading={this.props.loading}
					columns={columns}
					value={this.state.list}
					paginaction={this.state.limit}
					onPaginactionChange={this.onPaginactionChange}
					onSelect={this.props.onSelect}/>
			</div>
		);
	}
}