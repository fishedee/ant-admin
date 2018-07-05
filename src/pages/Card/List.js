import React,{Fragment} from 'react';
import { connect } from 'redva';
import { Button , Input ,Select,InputNumber,Badge,Divider} from 'antd';
import MyDatePicker from '@/components/MyDatePicker';
import MyTimePicker from '@/components/MyTimePicker';
import StandardQuery from '@/components/StandardQuery';
import StandardTable from '@/components/StandardTable';
import StandardModal from '@/components/StandardModal';
import PageHeader from '@/components/PageHeader';
import moment from 'moment';
import Detail from './Detail';

const {MyRangePicker,MyWeekPicker,MyMonthPicker} = MyDatePicker;
const {Option} = Select;
const typeOption = {
	1:'储蓄卡',
	2:'信用卡'
};

@connect((state)=>{
	return {loading:state.loading.global};
})
export default class Table extends React.Component{
	state = {
		modalVisible:false,
		list:[],
		where:{},
		limit:{
			pageIndex:0,
			pageSize:10,
			count:0,
		}
	};
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
			where.creatTime = undefined;
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
	mod = (cardId)=>{

	}
	del = (cardId)=>{

	}
	openModal = ()=>{
		this.setState({modalVisible:true});
	}
	closeModal = ()=>{
		this.setState({modalVisible:false});
	}
	render = ()=>{
		let queryColumns = [
			{
				title:"名称",
				field:"name",
				render:()=>{
					return (<Input placeholder="请输入"/>);
				}
			},
			{
				title:"类型",
				field:"type",
				render:()=>{
					return (<Select placeholder="请选择" style={{ width: '100%' }}>
						{Object.entries(typeOption).map((option)=>{
							return (<Option value={option[0]} key={option[0]}>{option[1]}</Option>);
						})}
	                </Select>);
				}
			},
			{
				title:"时间",
				field:"createTime",
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
	            <a onClick={this.mod.bind(data.cardId)}>修改</a>
	            <Divider type="vertical" />
	            <a onClick={this.del.bind(data.cardId)}>删除</a>
	          </Fragment>
	        ),
	      },
	    ];
		return (
			<PageHeader title="银行卡列表">
				<StandardQuery 
					columns={queryColumns} 
					data={this.state.where}
					onChange={this.onQueryChange}
					onSubmit={this.onQuerySubmit}/>
				<div><Button type="primary" onClick={this.openModal}>新建</Button></div>
				<StandardTable 
					rowKey={'cardId'}
					loading={this.props.loading}
					columns={columns}
					data={this.state.list}
					paginaction={this.state.limit}
					onPaginactionChange={this.onPaginactionChange}/>
			</PageHeader>
		);
	}
}