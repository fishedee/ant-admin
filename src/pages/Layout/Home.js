import React from 'react';
import Navigator from '@/components/Navigator';
import GlobalFooter from '@/components/GlobalFooter';
import {copyright,title} from '@/utils/constant';
import authority from '@/utils/authority';
import menu from '@/utils/menu';
import style from './Home.less';
import {connect} from 'redva';

@authority(['admin','user'])
@connect((state)=>{
	return {login:state.login};
})
export default class Home extends React.Component{
	onSelect = (path)=>{
		this.props.history.push(path);
	}
	logout = (data)=>{
		this.props.dispatch({
			type:'/login/logout',
		});
	}
	render(){
		const login = {
			name:this.props.login.name,
			dropdown:[
				{name:"退出",onClick:this.logout}
			]
		}
		return (
			<Navigator title={title} menu={menu} url={this.props.location.pathname} onSelect={this.onSelect} login={login}>
				{this.props.children}
			</Navigator>
		);
	}
}