import React from 'react';
import {Input} from 'antd';

export default class MyInputButton extends React.Component{
	onClick = ()=>{
		this.props.onClick();
	}
	onChange = ()=>{

	}
	render = ()=>{
		let props = {
			...this.props,
			onClick:this.onClick,
			onChange:this.onChange,
			value:this.props.children,
			children:null,
		}
		return (<Input {...props}/>);
	}
}