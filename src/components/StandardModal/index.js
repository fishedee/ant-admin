import React from 'react';
import { Modal } from 'antd';

export default class StandardModal extends React.Component{
	state = {
		confirmLoading:false,
	};
	child = null;
	setModalOk = (child)=>{
		this.child = child
	}
	onOk = async ()=>{
		try{
			this.setState({confirmLoading:true});
			await this.child(this.props.onOk);
		}finally{
			this.setState({confirmLoading:false});
		}
	}
	onCancel = ()=>{
		this.props.onCancel();
	}
	render = ()=>{
		return (
			<Modal
				title="表单"
				visible={this.props.visible}
				onOk={this.onOk}
				onCancel={this.onCancel}
				destroyOnClose={true}
				confirmLoading={this.state.confirmLoading}>
				{React.cloneElement(this.props.children,{
					setModalOk:this.setModalOk
				})}
			</Modal>
		);
	}
}