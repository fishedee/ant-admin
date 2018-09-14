import React from 'react';
import {Select} from 'antd';

const Option = Select.Option;

export default class MySelect extends React.Component{
	render = ()=>{
		let {value,style,options,renderOption,filterOption,placeholder,...resetProps} = this.props;
		style = {
			minWidth:'170px',
			...style,
		}
		renderOption = renderOption || function(value,key){
			return value;
		}
		filterOption = filterOption || function(input, option){
			return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
		}
		if( !options['0']){
			//options没有0值时，0和undefined等同
			if( !value ){
				value = undefined;
			}
		}
		return (<Select 
			placeholder={placeholder}
			allowClear={true} 
			style={style} 
			filterOption={filterOption}
			value={value}
			{...resetProps}>
			{Object.entries(options).map((data)=>{
				return (<Option key={parseInt(data[0])} value={parseInt(data[0])}>{renderOption(data[1],parseInt(data[0]))}</Option>);
			})}
		</Select>);
	}
} 
