import React from 'react';
import { connect } from 'redva';
import {Input,Select,InputNumber,DatePicker} from 'antd';
import StandardForm from '@/components/StandardForm';
import qs from 'qs';
import cache from '@/utils/cache';

const Option = Select.Option;
const typeOption = ['未分类','储蓄卡','信用卡'];

@connect()
export default class Form extends React.Component{
	constructor(props){
		super(props);
		let query = qs.parse(this.props.location.search.substr(1));
		if( query.cardId ){
			this.state = {
				data:{},
				cardId:query.cardId
			}
		}else{
			this.state = cache.get('/card2/detail') || {
				data:{}
			}
		}
	}
	componentDidUpdate = ()=>{
		if( !this.state.cardId ){
			cache.set('/card2/detail',this.state);
		}
	}
	form = null;
	onChange = (data)=>{
		this.state.data = data;
		this.setState({});
	}
	componentDidMount = async ()=>{
		if( this.state.cardId ){
			let data = await this.props.dispatch({
				type:'/card/get',
				payload:{
					cardId:this.state.cardId,
				}
			});
			this.state.data = data;
			this.setState({});
		}
	}
	onSubmit = async ()=>{
		if( this.state.cardId ){
			await this.props.dispatch({
				type:'/card/mod',
				payload:{
					cardId:this.state.cardId,
					...this.state.data,
				}
			});
		}else{
			await this.props.dispatch({
				type:'/card/add',
				payload:this.state.data,
			});
			this.state.data = {};
			this.componentDidUpdate();
		}
		this.props.history.go(-1);
	}
	render = ()=>{
		let columns = [
			{
				title:"名称",
				dataIndex:"name",
				rules:[{ required: true}],
				render:()=>{
					return (<Input placeholder="请输入"/>);
				}
			},
			{
				title:"类型",
				dataIndex:"type",
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