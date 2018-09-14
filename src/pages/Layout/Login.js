import React from 'react';
import {Col} from 'antd';
import CheckIn from '@/components/CheckIn';
import GlobalFooter from '@/components/GlobalFooter';
import {copyright,title} from '@/utils/constant';
import style from './Login.less';
import qs from 'qs';
import {connect} from 'redva';

@connect()
export default class LoginPage extends React.Component{
	onSubmit = async (value)=>{
		await this.props.dispatch({
			type:'login/login',
			payload:{
				name:value.userName,
				password:value.password,
			}
		});
		let query = qs.parse(this.props.location.search.substr(1));
		if( query.redirect ){
			this.props.history.push('/');
			this.props.history.push(query.redirect);
		}else{
			this.props.history.push('/');
		}
	}
	render(){
		console.log();
		return (
		<div className={style.root}>
			<CheckIn 
				className={style.content}
				logo="https://image.fishedee.com/FulTCoakq411USQX_3HiZ79_fH0i"
				title={title}
				userNamePlaceHolder="admin/user"
				passwordPlaceHolder="888888/123456"
				onSubmit={this.onSubmit}
			/>
			<GlobalFooter className={style.footer} copyright={copyright}/>
		</div>
		);
	}
}