import React from 'react';
import { connect } from 'redva';
import {Input,Select,InputNumber,DatePicker} from 'antd';
import StandardForm from '@/components/StandardForm';

const Option = Select.Option;
const typeOption = ['未分类','储蓄卡','信用卡'];

@connect()
export default class Form extends React.Component{
	state = {
		data:{}
	}
	form = null;
	onChange = (data)=>{
		this.state.data = data;
		this.setState({});
	}
	componentDidMount = async ()=>{
		this.props.setModalOk(this.onModalOk);
		if( this.props.cardId ){
			let data = await this.props.dispatch({
				type:'/card/get',
				payload:{
					cardId:this.props.cardId,
				}
			});
			this.state.data = data.data;
			this.setState({});
		}
	}
	onModalOk = async (onOk)=>{
		let {err,data} = await this.form.validateFields();
		if( err ){
			return;
		}
		if( this.props.cardId ){
			await this.props.dispatch({
				type:'/card/mod',
				payload:{
					cardId:this.props.cardId,
					...this.state.data,
				}
			});
		}else{
			await this.props.dispatch({
				type:'/card/add',
				payload:this.state.data,
			});
		}
		onOk();
	}
	render = ()=>{
		let columns = [
			{
				title:"名称",
				field:"name",
				rules:[{ required: true}],
				render:()=>{
					return (<Input placeholder="请输入"/>);
				}
			},
			{
				title:"类型",
				field:"type",
				rules:[{ required: true}],
				render:()=>{
					return (<Select placeholder="请选择" style={{ width: '100%' }}>
	                 	{typeOption.map((name,index)=>{
							return (<Option value={index} key={index}>{name}</Option>);
						})}
	                </Select>);
				}
			}
		];
		return (
			<StandardForm
				ref={(node)=>{this.form=node}}
				columns={columns}
				data={this.state.data}
				onChange={this.onChange}
			/>
		);
	}
}