import React from 'react';
import {connect} from 'redva';
import {Row,Col,Button,Input} from 'antd';
import MySelect from '@/components/MySelect';
import MyTreeSelect from '@/components/MyTreeSelect';
import StandardForm from '@/components/StandardForm';

@connect((state)=>{
	return {loading:state.loading.global};
})
export default class List extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			data:{},
			itemCategoryId:null,
			detail:{
				parent:0,
			}
		}
	}
	onChange = (itemCategoryId)=>{
		this.state.itemCategoryId = itemCategoryId;
		this.state.detail = this.state.data[itemCategoryId] || {
			parent:0
		}
		this.setState({});
	}
	onDetailChange = (detail)=>{
		this.state.detail = detail;
		this.setState({});
	}
	componentDidMount = ()=>{
		this.fetch();
	}
	fetch = async ()=>{
		let data = await this.props.dispatch({
			type:'/itemcategory/getAll'
		});
		let result = {};
		for( let i in data ){
			let single = data[i];
			result[single.itemCategoryId] = single;
		}
		this.state.data = result;
		this.setState({});
	}
	add = ()=>{
		this.state.detail = {
			itemCategoryId:null,
			name:'',
			parent:parseInt(this.state.itemCategoryId) || 0 ,
		};
		this.setState({});
	}
	del = async ()=>{
		if( !this.state.itemCategoryId ){
			return;
		}
		await this.props.dispatch({
			type:'/itemcategory/del',
			payload:{
				itemCategoryId:this.state.itemCategoryId,
			}
		});
		this.state.detail = {
			parent:0
		}
		this.state.itemCategoryId = 0;
		await this.fetch();
	}
	onSubmit = async ()=>{
		if( this.state.detail.itemCategoryId ){
			await this.props.dispatch({
				type:'/itemcategory/mod',
				payload:this.state.detail
			});
		}else{
			await this.props.dispatch({
				type:'/itemcategory/add',
				payload:this.state.detail,
			});
			this.state.detail = {
				parent:this.state.detail.parent
			};
		}
		this.fetch();
	}
	render = ()=>{
		let columns = [
			{
				title:"名称",
				dataIndex:"name",
				rules:[{ required: true}],
				render:()=>{
					return (<Input placeholder="请输入"/>);
				}
			},
			{
				title:"父级类别",
				dataIndex:"parent",
				rules:[{ required: true}],
				render:()=>{
					let allCategory = {
						0:{
							name:'无',
						},
						...this.state.data,
					}
					return (<MySelect placeholder="请选择" disabled={true} options={allCategory} renderOption={(data)=>(data.name)}/>);
				}
			}
		];
		return (
		<Row>
			<Col span={8}>
				<div>
					<Button type="primary" onClick={this.add}>添加</Button>
					<Button type="danger" style={{marginLeft:'16px'}} onClick={this.del}>删除</Button>
				</div>
				<MyTreeSelect 
					style={{marginTop:'16px'}}
					value={this.state.itemCategoryId}
					onChange={this.onChange}
					nodes={this.state.data} 
					renderNode={(data)=>('['+data.itemCategoryId+']'+data.name)}/>
			</Col>
			<Col span={16}>
				<StandardForm
					columns={columns}
					data={this.state.detail}
					onChange={this.onDetailChange}
					onSubmit={this.onSubmit}
				/>
			</Col>
		</Row>
		);
	}
} 