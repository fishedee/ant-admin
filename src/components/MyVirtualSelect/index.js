import React from 'react';
import ReactDom from 'react-dom';
import {Select} from 'antd';

const Option = Select.Option;

class WrapperSelect extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			scrollTop:0,
			scrollContainer:null,
		}
	}
	componentDidMount(){
		let rootNode = ReactDom.findDOMNode(this);
		this.state.scrollContainer = rootNode.children[0];
		this.state.scrollContainer.addEventListener('scroll',()=>{
			this.state.scrollTop = this.state.scrollContainer.scrollTop;
			this.setState({});
		})
		this.scrollToIndex(this.props.initScrollIndex);
	}
	scrollToIndex(index){
		const itemHeight = 32;
		let newScrollTop = index * itemHeight;
		if( newScrollTop - 120 >= 0 ){
			newScrollTop = newScrollTop - 120;
		}
		setTimeout(()=>{
			this.state.scrollContainer.scrollTop = newScrollTop;
		},100);
		
	}
	render(){
		let items = this.props.menuNode.props.menuItems;
		const itemHeight = 32;
		const totalHeight = 250; 
		const visibleCount = Math.ceil(totalHeight / itemHeight)+2;
		let firstIndex = Math.floor(this.state.scrollTop / itemHeight);
		const endIndex = firstIndex + visibleCount;
		const marginTop = (firstIndex*itemHeight)+'px'
		const marginBottom = (items.length - endIndex)*itemHeight+'px'

		let visibleItems = items.slice(firstIndex,endIndex);
		console.log(visibleItems[0]);
		visibleItems[0] = React.cloneElement(visibleItems[0],{
			style:{
				...visibleItems[0].props.style,
				marginTop:marginTop
			}
		})
		visibleItems[visibleItems.length-1] = React.cloneElement(visibleItems[visibleItems.length-1],{
			style:{
				...visibleItems[visibleItems.length-1].props.style,
				marginBottom:marginBottom
			}
		})
		return React.cloneElement(this.props.menuNode,{
			menuItems:visibleItems,
		});
	}
}

export default class MySelect extends React.Component{
	selectNode = null;
	constructor(props){
		super(props);
		this.state = {
			allOptions:[],
			visibleOptions:[],
			searchInput:"",
			scrollTop:0,
			wrapperSelectNode:null,
			containerNode:null,
			popupNode:null,
		}
	}
	onSearch = (input)=>{
		this.state.searchInput = input;
		this.setState({});
	}
	onScroll = (e)=>{
		this.state.containerNode = e.target;
		this.state.wrapperSelectNode.onScroll(e.target.scrollTop);
	}
	onDropdownVisibleChange = (isVisible)=>{
		if( isVisible ){
			let value = this.props.value;
			if( value instanceof Array ){
				value = value[0];
			}
			let index = this.state.allOptions.findIndex((data)=>{
				return data._key == value;
			});
			if( index == -1 ){
				index = 0;
			}
			if( this.state.wrapperSelectNode ){
				this.state.wrapperSelectNode.scrollToIndex(index);
			}
		}
	}
	focus = ()=>{
		if( this.selectNode ){
			this.selectNode.focus();
		}
	}
	setVisibleSelect = ()=>{
		//获取所有option
		let {renderOption,filterOption} = this.props;
		let allOptions = [];
		renderOption = renderOption || function(value,key){
			return value;
		}
		filterOption = filterOption || function(input, value,key){
			return renderOption(value,key).indexOf(input) != -1
		}
		for( var i in this.props.options ){
			let isExist = true;
			if( this.state.searchInput != "" ){
				isExist = filterOption(this.state.searchInput,this.props.options[i],parseInt(i));
			}
			if( isExist ){
				allOptions.push({
					_key:parseInt(i),
					_data:this.props.options[i],
					_show:renderOption(this.props.options[i],parseInt(i))
				});
			}
		}
		this.state.allOptions = allOptions;
	}
	dropdownRender = (menuNode,props)=>{
		let value = this.props.value;
		if( value instanceof Array ){
			value = value[0];
		}
		let index = this.state.allOptions.findIndex((data)=>{
			return data._key == value;
		});
		if( index == -1 ){
			index = 0;
		}
		return (<WrapperSelect 
			menuNode={menuNode}
			initScrollIndex={index}
			ref={(node)=>(this.state.wrapperSelectNode=node)}/>);
	}
	render = ()=>{
		let {mode,value,style,options,placeholder,...resetProps} = this.props;
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
		this.setVisibleSelect();
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
			value={value}
			ref={(node)=>(this.selectNode=node)}
			defaultActiveFirstOption={false}
			onSearch={this.onSearch}
			dropdownRender={this.dropdownRender}
			onDropdownVisibleChange={this.onDropdownVisibleChange}
			{...resetProps}>
			{this.state.allOptions.map((data)=>{
				return (<Option style={data._style} data={data._data} key={data._key} value={data._key}>{data._show}</Option>);
			})}
		</Select>);
	}
} 
