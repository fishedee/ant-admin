import React,{Fragment} from 'react';
import { Button , Input ,Select,InputNumber,DatePicker,Badge,Divider} from 'antd';
import StandardQuery from '@/components/StandardQuery';
import StandardTable from '@/components/StandardTable';
import PageHeader from '@/components/PageHeader';
import moment from 'moment';

const Option = Select.Option;
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];

export default class Table extends React.PureComponent{
	state = {
		selectedRow: [],
		paginaction:{
			pageIndex:0,
			pageSize:10,
			count:1000,
		},
		list:[
			{no:10001,description:'123',callNo:1,status:1,updatedAt:new Date()},
			{no:10002,description:'123',callNo:1,status:1,updatedAt:new Date()},
			{no:10003,description:'123',callNo:1,status:1,updatedAt:new Date()},
		]
	};

	onQuerySubmit = (data)=>{
		console.log("query data",data);
	}
	onChange = (key,dataIndex,value,newList)=>{
		this.setState({
			list:newList,
		});
	}
	onSelectedRowChange = (rows)=>{
		this.setState({
			selectedRow:rows,
		});
	}
	onPaginactionChange = (paginaction)=>{
		this.setState({
			paginaction:paginaction
		});
	}
	render = ()=>{
		let queryColumns = [
			{
				title:"规则编号",
				field:"rule",
				render:()=>{
					return (<Input placeholder="请输入"/>);
				}
			},
			{
				title:"使用状态",
				field:"status",
				render:()=>{
					return (<Select placeholder="请选择" style={{ width: '100%' }}>
	                  <Option value="0">关闭</Option>
	                  <Option value="1">运行中</Option>
	                </Select>);
				}
			},
			{
				title:"调用次数",
				field:"number",
				render:()=>{
					return (<InputNumber style={{ width: '100%' }} />);
				}
			},
			{
				title:"更新日期",
				field:"date",
				render:()=>{
					return (<DatePicker style={{ width: '100%' }} placeholder="请输入更新日期" />);
				}
			}
		];
		 const columns = [
	      {
	        title: '规则编号',
	        dataIndex: 'no',
	      },
	      {
	        title: '描述',
	        dataIndex: 'description',
	        render:(text,record)=>{
	        	return (<Input/>);
	        }
	      },
	      {
	        title: '服务调用次数',
	        dataIndex: 'callNo',
	        align: 'right',
	        render: val => `${val} 万`,
	      },
	      {
	        title: '状态',
	        dataIndex: 'status',
	        render(val) {
	          return <Badge status={statusMap[val]} text={status[val]} />;
	        },
	      },
	      {
	        title: '更新时间',
	        dataIndex: 'updatedAt',
	        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
	      },
	      {
	        title: '操作',
	        render: () => (
	          <Fragment>
	            <a href="">配置</a>
	            <Divider type="vertical" />
	            <a href="">订阅警报</a>
	          </Fragment>
	        ),
	      },
	    ];
		return (
			<PageHeader title="查询表格">
				<StandardQuery columns={queryColumns} onSubmit={this.onQuerySubmit}/>
				<div><Button type="primary">新建</Button></div>
				<StandardTable 
					rowKey={'no'}
					loading={false}
					columns={columns}
					data={this.state.list}
					onChange={this.onChange}
					selectedRow={this.state.selectedRow}
					onSelectedRowChange={this.onSelectedRowChange}
					paginaction={this.state.paginaction}
					onPaginactionChange={this.onPaginactionChange}/>
			</PageHeader>
		);
	}
}