import React from 'react';
import { connect } from 'redva';
import {Input,InputNumber} from 'antd';
import MySelect from '@/components/MySelect';
import MyInputDecimal from '@/components/MyInputDecimal';
import StandardForm from '@/components/StandardForm';

@connect()
export default class Form extends React.Component{
	priceNode = null;
	numNode = null;
	constructor(props){
		super(props)
		this.state = {
			data:this.props.data
		}
	}
	onChange = (data)=>{
		this.state.data = data;
		this.setState({});
	}
	onSubmit = async ()=>{
		this.props.onSubmit(this.state.data);
	}
	onKeyDown = (event)=>{
		if( event.keyCode == 13 ){
			this.numNode.focus();
			event.preventDefault();
			return true;
		}
	}
	componentDidMount = ()=>{
		this.priceNode.focus();
	}
	render = ()=>{
		let columns = [
			{
				title:"商品",
				dataIndex:"itemId",
				rules:[{ required: true}],
				render:()=>{
					return (<MySelect options={this.props.allItems} renderOption={(data)=>(data.name)}/>);
				}
			},
			{
				title:"单价",
				dataIndex:"price",
				rules:[{ required: true}],
				render:()=>{
					return (<MyInputDecimal style={{width:'100%'}}  precision={2} ref={(node)=>{this.priceNode=node}} onKeyDown={this.onKeyDown}/>);
				}
			},
			{
				title:"数量",
				dataIndex:"num",
				rules:[{ required: true}],
				render:()=>{
					return (<MyInputDecimal style={{width:'100%'}} precision={0} ref={(node)=>{this.numNode=node}}/>);
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