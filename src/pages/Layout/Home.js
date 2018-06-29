import React from 'react';
import Navigator from '@/components/Navigator';
import GlobalFooter from '@/components/GlobalFooter';
import {copyright,title} from '@/utils/constant';
import style from './Home.less';
import menu from '@/utils/menu';

export default class Home extends React.PureComponent{
	onSelect = (path)=>{
		console.log(path);
		this.props.history.push(path);
	}
	onClick = (data)=>{
		alert(data);
	}
	render(){
		const login = {
			name:"fishedee",
			dropdown:[
				{name:"设置密码",onClick:this.onClick.bind(this,'1')},
				{name:"退出",onClick:this.onClick.bind(this,'2')}
			]
		}
		return (
			<Navigator title={title} menu={menu} url={this.props.location.pathname} onSelect={this.onSelect} login={login}>
				{this.props.children}
			</Navigator>
		);
	}
}