import React,{Fragment} from 'react';
import { connect } from 'redva';
import { Button , Input , Divider,Popconfirm} from 'antd';
import StandardForm from '@/components/StandardForm';
import MyTableList from '@/components/MyTableList';

@connect((state)=>{
	return {loading:state.loading.global};
})
export default class List extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			data:{},
			itemMap:{},
			itemId:0,
		}
	}
	tableSelect = null
	onTableSelectChange = (itemId)=>{
		this.state.itemId = itemId;
		this.setState({});
	}
	filterTableSelect = (input,data)=>{
		if( data.name.indexOf(input) != -1 ){
			return true;
		}
		if( (data.itemId+'').indexOf(input) != -1 ){
			return true;
		}
		return false;
	}
	onTableSelectSelect = (itemId)=>{
		alert(itemId);
	}
	componentDidMount = ()=>{
		this.fetch();
	}
	onChange = (data)=>{
		this.state.data = data;
		this.setState({});
	}
	fetch = async ()=>{
		var nameCount = 1000;
		var nameInfo = {};
		for( var i = 0 ;i != nameCount;i++){
			nameInfo[i+1] = {
				itemId:i+1,
				name:'fish_'+(i+1),
			};
		}
		this.state.itemMap = nameInfo;
		this.setState({});
	}
	render = ()=>{
		let selectedColumns = [
			{
				title: '商品ID',
				dataIndex: 'itemId',
			},
			{
				title: '名字',
				dataIndex: 'name',
			},
		];
		return (
			<MyTableList
				ref={(node)=>{this.tableSelect=node}}
				value={this.state.itemId}
				onChange={this.onTableSelectChange}
				rows={this.state.itemMap}
				renderRow={selectedColumns}
				filterRow={this.filterTableSelect}
				onSelect={this.onTableSelectSelect}/>
		);
	}
}