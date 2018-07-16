import React from 'react';
import { connect } from 'redva';
import {Input,InputNumber,Button} from 'antd';
import MySelect from '@/components/MySelect';
import MyInputButton from '@/components/MyInputButton';
import StandardForm from '@/components/StandardForm';
import StandardTable from '@/components/StandardTable';
import StandardModal from '@/components/StandardModal';
import CardList from '@/pages/Card2/Select';
import qs from 'qs';
import cache from '@/utils/cache';
import InputWrapper from '@/components/InputWrapper';

@connect()
export default class Detail extends React.Component{
	constructor(props){
		super(props);
		let query = qs.parse(this.props.location.search.substr(1));
		if( query.orderId ){
			this.state = {
				modalVisible:false,
				data:{},
				itemMap:{},
				orderId:query.orderId
			}
		}else{
			this.state = {
				modalVisible:false,
				itemMap:{},
				data:cache.get('/order/detail') || {}
			}
		}
	}
	componentDidUpdate = ()=>{
		if( !this.state.orderId ){
			cache.set('/order/detail',this.state.data);
		}
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
	delItems = (key)=>{
		let index = this.state.data.items.findIndex((single)=>{
			return single._key == key;
		})
		if( index != -1 ){
			this.state.data.items.splice(index,1);
			this.setState({});
		}
	}
	addItem = ()=>{
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
		});
		this.setState({});
	}
	onCardChange = (card)=>{
		this.state.data.cardId = card.cardId;
		this.state.data.cardName = card.name;
		this.state.modalVisible = false;
		this.setState({});
	}
	componentDidMount = async ()=>{
		let data = await this.props.dispatch({
			type:'/item/getAll',
		});
		let itemMap = {};
		for( let i in data.data.data ){
			itemMap[data.data.data[i].itemId] = data.data.data[i];
		}
		this.state.itemMap = itemMap;
		if( this.state.orderId ){
			let data = await this.props.dispatch({
				type:'/order/get',
				payload:{
					orderId:this.state.orderId,
				}
			});
			data = data.data;
			for( let i in data.items ){
				data.items[i]._key = parseInt(i);
			}
			let cardInfo = await this.props.dispatch({
				type:'/card/get',
				payload:{
					cardId:data.cardId,
				}
			});
			data.cardName = cardInfo.data.name;
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
		let columns = [
			{
				title:"客户",
				dataIndex:"name",
				labelCol:{span:2},
				wrapperCol:{span:10},
				rules:[{ required: true}],
				render:()=>{
					return (<Input placeholder="请输入"/>);
				}
			},
			{
				title:"电话",
				dataIndex:"phone",
				labelCol:{span:2},
				wrapperCol:{span:10},
				rules:[{ required: true}],
				render:()=>{
					return (<Input placeholder="请输入"/>);
				}
			},
			{
				title:"银行卡",
				dataIndex:"cardId",
				labelCol:{span:2},
				wrapperCol:{span:10},
				rules:[{ required: true}],
				render:()=>{
					let name = '';
					if( this.state.data.cardId ){
						name = '['+this.state.data.cardId+']'+this.state.data.cardName;
					}
					return (
					<div>
						<MyInputButton placeholder="请输入" onClick={()=>{this.state.modalVisible=true;this.setState({});}}>{name}</MyInputButton>
						<StandardModal 
							visible={this.state.modalVisible}
							onCancel={()=>{this.state.modalVisible=false;this.setState({});}}>
							<CardList onSelect={this.onCardChange}/>
						</StandardModal>
					</div>);
				}
			},
			{
				title:"地址",
				dataIndex:"address",
				labelCol:{span:2},
				wrapperCol:{span:10},
				rules:[{ required: true}],
				render:()=>{
					return (<Input placeholder="请输入"/>);
				}
			},
			{
				title:"商品",
				dataIndex:"items",
				labelCol:{span:2},
				wrapperCol:{span:22},
				rules:[{ required: true}],
				render:(value)=>{
					const columns = [
					  {
					  	title:'商品',
					  	dataIndex:'itemId',
					  	render:()=>{
					  		return (<MySelect style={{width:"100%"}} options={this.state.itemMap} showSearch={true} renderOption={(value,key)=>('['+key+']'+value.name)}/>);
					  	}
					  },
				      {
				        title: '单价',
				        dataIndex: 'price',
				        render:()=>{
				        	return (<InputNumber style={{width:'100%'}} step={0.01} precision={2}/>);
				        }
				      },
				      {
				        title: '数量',
				        dataIndex: 'num',
				        render:()=>{
				        	return (<InputNumber style={{width:'100%'}} step={1} precision={0}/>);
				        }
				      },
				      {
				        title: '总价',
				        dataIndex: 'amount',
				        render:()=>{
				        	return (<InputNumber style={{width:'100%'}} step={0.01} precision={2} disabled={true}/>);
				        }
				      },
				      {
				        title: '操作',
				        render:(val,data)=>{
				        	return (<a onClick={this.delItems.bind(this,data._key)}>删除</a>);
				        }
				      }
				    ];
					return (
						<InputWrapper
							prefix={<Button type="primary" onClick={this.addItem}>添加</Button>}>
							<StandardTable
								style={{marginTop:'16px'}}
								rowKey={'_key'}
								columns={columns}
							/>
						</InputWrapper>
					);
				}
			},
			{
				title:"总价",
				dataIndex:"total",
				labelCol:{span:2},
				wrapperCol:{span:22},
				rules:[{ required: true}],
				render:()=>{
					return (<InputNumber style={{width:'100%'}} disabled={true} step={0.01} precision={2}/>);
				}
			},
		];
		return (
			<StandardForm
				ref={(node)=>{this.form=node}}
				columns={columns}
				data={this.state.data}
				onChange={this.onChange}
				submitCol={{span:22,offset:2}}
				onSubmit={this.onSubmit}
			/>
		);
	}
}