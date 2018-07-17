import React from 'react';
import { connect } from 'redva';
import {Input,InputNumber,Button} from 'antd';
import MySelect from '@/components/MySelect';
import MyModalSelect from '@/components/MyModalSelect';
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
				data:{},
				itemMap:{},
				cardInfo:null,
				orderId:query.orderId
			}
		}else{
			this.state = cache.get('/order/detail') || {
				data:{},
				itemMap:{},
				cardInfo:null,
			}
		}
	}
	componentDidUpdate = ()=>{
		if( !this.state.orderId ){
			cache.set('/order/detail',this.state);
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
			this.onChange(this.state.data);
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
		this.onChange(this.state.data);
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
					return (
						<MyModalSelect 
							placeholder="请输入"
							renderValue={(value)=>('['+value+']'+this.state.cardInfo.name)}
							extactValue={(data)=>{this.state.cardInfo=data;return data.cardId}}>
							<CardList/>
						</MyModalSelect>);
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
					  		return (<MySelect placeholder="请选择" style={{width:"100%"}} options={this.state.itemMap} showSearch={true} renderOption={(value,key)=>('['+key+']'+value.name)}/>);
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