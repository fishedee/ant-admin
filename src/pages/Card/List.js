import React,{Fragment} from 'react';
import { connect } from 'redva';
import { Button , Input ,InputNumber,Divider,Popconfirm} from 'antd';
import MySelect from '@/components/MySelect';
import MyDatePicker from '@/components/MyDatePicker';
import MyTimePicker from '@/components/MyTimePicker';
import StandardQuery from '@/components/StandardQuery';
import StandardTable from '@/components/StandardTable';
import StandardModal from '@/components/StandardModal';
import Xlsx from '@/components/Xlsx';
import Detail from './Detail';

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
	state = {
		modalVisible:false,
		modalCardId:null,
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
		this.state.modalVisible = true;
		this.state.modalCardId = null;
		this.setState({});
	}
	mod = async (cardId)=>{
		this.state.modalVisible = true;
		this.state.modalCardId = cardId;
		this.setState({});
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
	excel = async ()=>{
		let where = { ...this.state.where };
		if( where.createTime ){
			where.beginTime = where.createTime[0]+' 00:00:00',
			where.endTime = where.createTime[1]+' 23:59:59',
			where.createTime = undefined;
		}
		let limit = { 
			pageIndex:0,
			pageSize:1000,
		};
		let data = await this.props.dispatch({
			type:'/card/search',
			payload:{
				...where,
				...limit,
			}
		});
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
	      }
	    ];
		let xlsx = Xlsx.fromJson("银行卡列表",data.data,columns);
		xlsx.exportFile("银行卡列表.xlsx");
	}
	closeModal = async (isOk)=>{
		this.state.modalVisible = false;
		this.setState({});
		if( isOk ){
			await this.fetch();
		}
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
					onChange={this.onQueryChange}
					onSubmit={this.onQuerySubmit}/>
				<div style={{marginTop:'16px'}}>
					<Button type="primary" onClick={this.add}>添加</Button>
					<Button style={{marginLeft:'16px'}} onClick={this.excel}>导出excel</Button>
				</div>
				<StandardTable 
					style={{marginTop:'16px'}}
					rowKey={'cardId'}
					loading={this.props.loading}
					columns={columns}
					value={this.state.list}
					paginaction={this.state.limit}
					onPaginactionChange={this.onPaginactionChange}/>
				<StandardModal 
					visible={this.state.modalVisible}
					onCancel={this.closeModal.bind(this,false)}>
					<Detail 
						cardId={this.state.modalCardId}
						onSubmit={this.closeModal.bind(this,true)}/>
				</StandardModal>
			</div>
		);
	}
}