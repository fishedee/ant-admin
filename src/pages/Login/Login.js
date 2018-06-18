import React from 'react';
import {Col} from 'antd';
import CheckIn from '@/components/CheckIn';
import GlobalFooter from '@/components/GlobalFooter';
import {copyright,title} from '@/utils/constant';
import style from './Login.less';

export default class LoginPage extends React.PureComponent{
	onSubmit = (value)=>{
		console.log(value);
	}
	render(){
		return (
		<div className={style.root} type="flex">
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