import React from 'react';
import {AutoComplete} from 'antd';

export default class MyAutoComplete extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			value:'',
			prevValue:'',
		};
	}
	onBlur = ()=>{
		this.props.onChange(this.state.value);
	}
	onChange = (data)=>{
		this.state.value = data;
		this.setState({});
	}
	render = ()=>{
		let { value,dataSource , onChange,filterOption,...resetProps } = this.props; 
		filterOption = filterOption || function(inputValue,option){
			 return option.props.children.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1;
		}
		if( value != this.state.prevValue ){
			this.state.value = value;
			this.state.prevValue = value;
		}
		return (<AutoComplete 
			backfill={true}
			dataSource={dataSource} 
			filterOption={filterOption}
			onBlur={this.onBlur} 
			value={this.state.value}
			onChange={this.onChange}
			{...resetProps}/>);
	}
}