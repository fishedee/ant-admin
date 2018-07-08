import React from 'react';
import { connect } from 'redva';
import {Input,Select,InputNumber,DatePicker} from 'antd';
import StandardForm from '@/components/StandardForm';
import qs from 'qs';

const Option = Select.Option;
const typeOption = ['未分类','储蓄卡','信用卡'];

@connect()
export default class Form extends React.Component{
	state = {
		data:{},
		cardId:null,
	}
	form = null;
	onChange = (data)=>{
		this.state.data = data;
		this.setState({});
	}
	componentDidMount = async ()=>{
		let query = qs.parse(this.props.location.search.substr(1));
		this.state.cardId = query.cardId;

		if( this.state.cardId ){
			let data = await this.props.dispatch({
				type:'/card/get',
				payload:{
					cardId:this.state.cardId,
				}
			});
			this.state.data = data.data;
			this.setState({});
		}
	}
	onSubmit = async ()=>{
		if( this.state.cardId ){
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
		this.props.history.go(-1);
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
				onSubmit={this.onSubmit}
			/>
		);
	}
}