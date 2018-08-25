import React from 'react';
import { connect } from 'redva';
import {Input,Select,InputNumber,DatePicker} from 'antd';
import MyRadio from '@/components/MyRadio';
import StandardForm from '@/components/StandardForm';

const Option = Select.Option;
const typeOption = {
	1:'储蓄卡',
	2:'信用卡',
}

@connect()
export default class Form extends React.Component{
	state = {
		data:{}
	}
	onChange = (data)=>{
		this.state.data = data;
		this.setState({});
	}
	componentDidMount = async ()=>{
		if( this.props.cardId ){
			let data = await this.props.dispatch({
				type:'/card/get',
				payload:{
					cardId:this.props.cardId,
				}
			});
			this.state.data = data;
			this.setState({});
		}
	}
	onSubmit = async ()=>{
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
		this.props.onSubmit();
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
					return (<MyRadio radios={typeOption}/>);
				}
			}
		];
		return (
			<StandardForm
				columns={columns}
				data={this.state.data}
				onChange={this.onChange}
				onSubmit={this.onSubmit}
			/>
		);
	}
}