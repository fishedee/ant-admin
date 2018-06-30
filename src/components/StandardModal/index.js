import React from 'react';
import { Modal } from 'antd';

export default class StandardModal extends React.PureComponent{
	state = {
		confirmLoading:false,
	};
	child = null;
	onOk = async ()=>{
		this.setState({confirmLoading:true});
		await this.child.onModalOk2(this.props.onOk);
		this.setState({confirmLoading:false});
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
					ref:(node)=>{
						this.child = node;
					}
				})}
			</Modal>
		);
	}
}