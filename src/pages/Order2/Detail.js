import React,{Fragment} from 'react';
import { connect } from 'redva';
import {Input,InputNumber,Button,Row,Col,Divider} from 'antd';
import MySelect from '@/components/MySelect';
import MyTableSelect from '@/components/MyTableSelect';
import MyInputButton from '@/components/MyInputButton';
import StandardForm from '@/components/StandardForm';
import StandardTable from '@/components/StandardTable';
import StandardModal from '@/components/StandardModal';
import CardList from '@/pages/Card2/Select';
import qs from 'qs';
import cache from '@/utils/cache';
import InputWrapper from '@/components/InputWrapper';
import ItemDetail from './ItemDetail';

@connect()
export default class Detail extends React.Component{
	tableSelect = null;
	constructor(props){
		super(props);
		let query = qs.parse(this.props.location.search.substr(1));
		if( query.orderId ){
			this.state = {
				data:{},
				itemMap:{},
				cardInfo:null,
				orderId:query.orderId
			}
		}else{
			this.state = cache.get('/order2/detail') || {
				data:{},
				itemMap:{},
				cardInfo:null,
			}
		}
		this.state.modalVisible = false;
		this.state.itemModalVisible = false;
		this.state.itemId = undefined
	}
	componentDidUpdate = ()=>{
		if( !this.state.orderId ){
			cache.set('/order2/detail',this.state);
		}
	}
	onTableSelectChange = (itemId)=>{
		this.state.itemId = itemId;
		this.setState({});
	}
	filterTableSelect = (data,input)=>{
		if( data.name.indexOf(input) != -1 ){
			return true;
		}
		if( (data.itemId+'').indexOf(input) != -1 ){
			return true;
		}
		return false;
	}
	onTableSelectSelect = (itemId)=>{
		this.state.itemModalVisible = true;
		this.state.itemModalData = {
			itemId:itemId,
		}
		this.setState({});
	}
	round = (num)=>{
		return Math.round(parseFloat(num*100))/100
	}
	onChange = (data)=>{
		let total = 0.0;
		for( const i in data.items ){
			let item = data.items[i];
			item.price = item.price;
			item.num = item.num;
			item.amount = this.round(item.price * item.num);
			total += item.amount;
		}
		data.total = total
		this.state.data = data;
		this.setState({});
	}
	submitItem = (data)=>{
		this.state.itemModalVisible = false;
		this.tableSelect.clear();
		this.tableSelect.focus();
		this.setState({});
		if( data._key ){
			let index = this.state.data.items.findIndex((single)=>{
				return single._key == data._key;
			});
			if( index != -1 ){
				this.state.data.items[index] = data;
			}
			this.onChange(this.state.data);
		}else{
			this.state.data.items = this.state.data.items || [];
			let maxKey = this.state.data.items.reduce((max,single)=>{
				if( max > single._key ){
					return max;
				}else{
					return single._key;
				}
			},0);
			this.state.data.items.push({
				_key:maxKey+1,
				itemId:data.itemId,
				price:data.price,
				num:data.num,
			});
			this.onChange(this.state.data);
		}
	}
	modItem = (key)=>{
		let index = this.state.data.items.findIndex((single)=>{
			return single._key == key;
		});
		if( index != -1 ){
			this.state.itemModalVisible = true;
			this.state.itemModalData = this.state.data.items[index];
			this.setState({});
		}
	}
	delItem = (key)=>{
		let index = this.state.data.items.findIndex((single)=>{
			return single._key == key;
		})
		if( index != -1 ){
			this.state.data.items.splice(index,1);
			this.onChange(this.state.data);
		}
	}
	componentDidMount = async ()=>{
		let data = await this.props.dispatch({
			type:'/item/getAll',
		});
		let itemMap = {};
		for( let i in data.data ){
			itemMap[data.data[i].itemId] = data.data[i];
		}
		this.state.itemMap = itemMap;
		this.tableSelect.clear();
		this.tableSelect.focus();
		if( this.state.orderId ){
			let data = await this.props.dispatch({
				type:'/order/get',
				payload:{
					orderId:this.state.orderId,
				}
			});
			for( let i in data.items ){
				data.items[i]._key = parseInt(i);
			}
			let cardInfo = await this.props.dispatch({
				type:'/card/get',
				payload:{
					cardId:data.cardId,
				}
			});
			this.state.cardInfo = cardInfo;
			this.state.data = data;
		}
		this.setState({});
	}
	onSubmit = async ()=>{
		if( this.state.orderId ){
			await this.props.dispatch({
				type:'/order/mod',
				payload:{
					orderId:this.state.orderId,
					...this.state.data,
				}
			});
		}else{
			await this.props.dispatch({
				type:'/order/add',
				payload:this.state.data,
			});
			this.state.data = {};
			this.componentDidUpdate();
		}
		this.props.history.go(-1);
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
		let columns = [
			{
				title:"客户",
				dataIndex:"name",
				labelCol:{span:4},
				wrapperCol:{span:8},
				rules:[{ required: true}],
				render:()=>{
					return (<Input placeholder="请输入"/>);
				}
			},
			{
				title:"电话",
				dataIndex:"phone",
				labelCol:{span:4},
				wrapperCol:{span:8},
				rules:[{ required: true}],
				render:()=>{
					return (<Input placeholder="请输入"/>);
				}
			},
			{
				title:"银行卡",
				dataIndex:"cardId",
				labelCol:{span:4},
				wrapperCol:{span:8},
				rules:[{ required: true}],
				render:()=>{
					let value = '';
					if( this.state.data.cardId ){
						value = '['+this.state.data.cardId+']'+this.state.cardInfo.name;
					}
					let openModal = ()=>{
						this.state.modalVisible = true;
						this.setState({});
					}
					let closeModal = ()=>{
						this.state.modalVisible = false ;
						this.setState({});
					}
					let onSelect = (data)=>{
						this.state.data.cardId = data.cardId;
						this.state.cardInfo = data;
						this.state.modalVisible = false ;
						this.setState({});
					}
					return (
					<Fragment>
						<MyInputButton onClick={openModal} placeholder="请选择">
							{value}
						</MyInputButton>
						<StandardModal
							title="选择银行卡"
							visible={this.state.modalVisible}
							onCancel={closeModal}>
							<CardList onSelect={onSelect}/>
						</StandardModal>
					</Fragment>
					);
				}
			},
			{
				title:"地址",
				dataIndex:"address",
				labelCol:{span:4},
				wrapperCol:{span:8},
				rules:[{ required: true}],
				render:()=>{
					return (<Input placeholder="请输入"/>);
				}
			},
			{
				title:"商品",
				dataIndex:"items",
				labelCol:{span:4},
				wrapperCol:{span:20},
				rules:[{ required: true}],
				render:(value)=>{
					const columns = [
					  {
					  	title:'商品',
					  	dataIndex:'itemId',
					  	render:(value)=>{
					  		return this.state.itemMap[value].name;
					  	}
					  },
				      {
				        title: '单价',
				        dataIndex: 'price',
				      },
				      {
				        title: '数量',
				        dataIndex: 'num',
				      },
				      {
				        title: '总价',
				        dataIndex: 'amount',
				      },
				      {
				        title: '操作',
				        render:(val,data)=>{
				        	return (
				        	<Fragment>
				        		<a onClick={this.modItem.bind(this,data._key)}>编辑</a>
				        		<Divider type="vertical" />
				        		<a onClick={this.delItem.bind(this,data._key)}>删除</a>
				        	</Fragment>);
				        }
				      }
				    ];
					return (
						<StandardTable
							rowKey={'_key'}
							columns={columns}
						/>
					);
				}
			},
			{
				title:"总价",
				dataIndex:"total",
				labelCol:{span:4},
				wrapperCol:{span:20},
				rules:[{ required: true}],
				render:()=>{
					return (<InputNumber style={{width:'100%'}} disabled={true} step={0.01} precision={2}/>);
				}
			},
		];
		return (
			<Row gutter={16}>
				<Col span={8}>
					<MyTableSelect
						ref={(node)=>{this.tableSelect=node}}
						value={this.state.itemId}
						onChange={this.onTableSelectChange}
						rows={this.state.itemMap}
						renderRow={selectedColumns}
						filterRow={this.filterTableSelect}
						onSelect={this.onTableSelectSelect}/>
					<StandardModal
						visible={this.state.itemModalVisible}
						onCancel={()=>{this.state.itemModalVisible=false;this.tableSelect.focus();this.setState({});}}>
						<ItemDetail 
							allItems={this.state.itemMap}
							onSubmit={this.submitItem} 
							data={this.state.itemModalData}/>
					</StandardModal>
				</Col>
				<Col span={16}>
					<StandardForm
						ref={(node)=>{this.form=node}}
						columns={columns}
						data={this.state.data}
						onChange={this.onChange}
						submitCol={{span:20,offset:4}}
						onSubmit={this.onSubmit}
					/>
				</Col>
			</Row>
			
		);
	}
}