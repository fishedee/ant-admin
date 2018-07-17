import React from 'react';
import {Input} from 'antd';
import StandardModal from '@/components/StandardModal';

export default class MyModalSelect extends React.Component{
	state = {
		modalVisible:false,
	}
	onClick = ()=>{
		this.setState({modalVisible:true});
	}
	onChange = ()=>{
		//do nothing
	}
	onCancel = ()=>{
		this.setState({modalVisible:false});
	}
	onSelect = (data)=>{
		let value = this.props.extactValue(data);
		this.props.onChange(value);
		this.setState({modalVisible:false});
	}
	render = ()=>{
		let value = '';
		if( this.props.value ){
			value = this.props.renderValue(this.props.value);
		}
		return (<div>
			<Input placeholder={this.props.placeholder} onClick={this.onClick} onChange={this.onChange} value={value}/>
			<StandardModal
				visible={this.state.modalVisible}
				onCancel={this.onCancel}>
				{React.cloneElement(this.props.children,{
					onSelect:this.onSelect
				})}
			</StandardModal>
		</div>);
	}
}