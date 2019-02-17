import React,{Fragment} from 'react';
import { connect } from 'redva';
import { Button , Input , Divider,Popconfirm} from 'antd';
import StandardForm from '@/components/StandardForm';
import MySelect from '@/components/MySelect';

@connect((state)=>{
	return {loading:state.loading.global};
})
export default class List extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			data:{},
			nameInfo:{},
		}
	}
	componentDidUpdate = ()=>{
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
			nameInfo[i] = {
				key:i,
				name:'fish_'+i,
			};
		}
		this.state.nameInfo = nameInfo;
		this.setState({});
	}
	render = ()=>{
		let columns = [
			{
				title:"商品",
				dataIndex:"itemIds",
				render:()=>{
					return (<MySelect 
						placeholder="请输入" 
						options={this.state.nameInfo} 
						showSearch={true} 
						renderOption={(value)=>('['+value.key+']'+value.name)}
						/>);
				}
			}
		];
		return (
			<StandardForm 
				columns={columns} 
				data={this.state.data}
				onChange={this.onChange}/>
		);
	}
}