import React from 'react';
import { connect } from 'redva';
import {Input,InputNumber} from 'antd';
import StandardForm from '@/components/StandardForm';
import StandardTable from '@/components/StandardTable';
import qs from 'qs';
import cache from '@/utils/cache';

@connect()
export default class Detail extends React.Component{
	constructor(props){
		super(props);
		let query = qs.parse(this.props.location.search.substr(1));
		if( query.orderId ){
			this.state = {
				data:{},
				orderId:query.orderId
			}
		}else{
			this.state = {
				data:cache.get('/order/detail') || {}
			}
		}
	}
	componentDidUpdate = ()=>{
		if( !this.state.orderId ){
			cache.set('/order/detail',this.state.data);
		}
	}
	onChange = (data)=>{
		this.state.data = data;
		//FIXME 计算合计和总价
		this.setState({});
	}
	delItems = (key)=>{
		let index = this.state.data.items.findIndex((single)=>{
			return single._key == key;
		})
		console.log(index,key);
		if( index != -1 ){
			this.state.data.items.splice(index,1);
			this.setState({});
		}
	}
	componentDidMount = async ()=>{
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
			console.log(data);
			this.state.data = data;
			this.setState({});
		}
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
				title:"地址",
				dataIndex:"address",
				labelCol:{span:2},
				wrapperCol:{span:22},
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
				        title: '单价',
				        dataIndex: 'price',
				        render:()=>{
				        	return (<Input style={{border:'0px'}}/>);
				        }
				      },
				      {
				        title: '数量',
				        dataIndex: 'num',
				        render:()=>{
				        	return (<Input style={{border:'0px'}}/>);
				        }
				      },
				      {
				        title: '总价',
				        dataIndex: 'amount',
				        render:()=>{
				        	return (<Input disabled={true}/>);
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
				labelCol:{span:2},
				wrapperCol:{span:22},
				rules:[{ required: true}],
				render:()=>{
					return (<Input disabled={true}/>);
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