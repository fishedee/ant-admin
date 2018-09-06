import React from 'react';
import qs from 'qs';
import Navigator from '@/components/Navigator';
import GlobalFooter from '@/components/GlobalFooter';
import {copyright,title} from '@/utils/constant';
import PageHeader from '@/components/PageHeader';
import authority from '@/utils/authority';
import {adminMenu,userMenu} from '@/utils/menu';
import {getRouterName} from '@/utils/router';
import style from './Home.less';
import {connect} from 'redva';
import cache from '@/utils/cache';

@authority(['admin','user'])
@connect((state)=>{
	return {login:state.login};
})
export default class Home extends React.Component{
	state = {
		key:1
	}
	onSelect = (path)=>{
		this.props.history.push(path);
	}
	onBack = ()=>{
		this.props.history.go(-1);
	}
	onReload = ()=>{
		this.setState({
			key:this.state.key+1
		});
	}
	clearCache = ()=>{
		cache.clear();
		this.onReload();
	}
	logout = (data)=>{
		this.props.history.push({
			pathname:'/login',
		});
	}
	render(){
		const login = {
			name:this.props.login.name,
			dropdown:[
				{name:"清空缓存",onClick:this.clearCache},
				{name:"退出",onClick:this.logout}
			]
		}
		const query = qs.parse(this.props.location.search.substr(1));
		const name = getRouterName(this.props.location.pathname);
		const role = this.props.login.role;
		var menu = null;
		if( role == 'admin'){
			menu = adminMenu;
		}else{
			menu = userMenu;
		}
		return (
			<Navigator 
				title={title} 
				menu={menu} 
				url={this.props.location.pathname} 
				onSelect={this.onSelect}
				login={login}>
				<PageHeader 
					title={name} 
					hasBack={!!query.hasBack} 
					onBack={this.onBack}
					onReload={this.onReload}>
					{React.cloneElement(this.props.children,{
						key:this.state.key,
					})}
				</PageHeader>
			</Navigator>
		);
	}
}