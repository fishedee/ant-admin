import React from 'react';
import {Select} from 'antd';

const Option = Select.Option;

export default class MySelect extends React.Component{
	selectNode = null;
	focus = ()=>{
		if( this.selectNode ){
			this.selectNode.focus();
		}
	}
	render = ()=>{
		let {mode,value,style,options,renderOption,filterOption,placeholder,...resetProps} = this.props;
		if( mode == "multiple"){
			style = {
				minWidth:'340px',
				...style,
			}
		}else{
			style = {
				minWidth:'170px',
				...style,
			}
		}
		renderOption = renderOption || function(value,key){
			return value;
		}
		filterOption = filterOption || function(input, value,key){
			return renderOption(value,key).indexOf(input) != -1
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
			mode={mode}
			filterOption={function(input, option){
				return filterOption(input,option.props.data,option.props.value)
			}}
			value={value}
			ref={(node)=>(this.selectNode=node)}
			{...resetProps}>
			{Object.entries(options).map((data)=>{
				return (<Option data={data[1]} key={parseInt(data[0])} value={parseInt(data[0])}>{renderOption(data[1],parseInt(data[0]))}</Option>);
			})}
		</Select>);
	}
} 
