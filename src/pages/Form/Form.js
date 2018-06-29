import React from 'react';
import {Input,Select,InputNumber,DatePicker} from 'antd';
import StandardForm from '@/components/StandardForm';
import PageHeader from '@/components/PageHeader';

const Option = Select.Option;

export default class Form extends React.PureComponent{
	state = {
		data:{}
	}
	onChange = (data)=>{
		this.setState({data:data});
	}
	onSubmit = (data)=>{
		console.log('submit',data);
	}
	render = ()=>{
		let columns = [
			{
				title:"规则编号",
				field:"rule",
				rules:[{ required: true,message:"请输入规则编号"}],
				render:()=>{
					return (<Input placeholder="请输入"/>);
				}
			},
			{
				title:"使用状态",
				field:"status",
				rules:[{ required: true}],
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
				rules:[{ required: true}],
				render:()=>{
					return (<InputNumber style={{ width: '100%' }} />);
				}
			},
			{
				title:"更新日期",
				field:"date",
				rules:[{ required: true}],
				render:()=>{
					return (<DatePicker style={{ width: '100%' }} placeholder="请输入更新日期" />);
				}
			}
		];
		return (
			<PageHeader title={"表单"}>
				<StandardForm
					columns={columns}
					data={this.state.data}
					onChange={this.onChange}
					onSubmit={this.onSubmit}
				/>
			</PageHeader>
		);
	}
}