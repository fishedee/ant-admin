import React from 'react';
import { Layout , Menu, Icon ,Avatar ,Dropdown} from 'antd';
import style from './index.less'

const {SubMenu} = Menu;
const { Header, Content, Sider } = Layout;

export default class Navigator extends React.Component{
	state = {
		prevProps:null
	}
	static getDerivedStateFromProps(props, state ) {
		if( state.prevProps == null ||
			props.url != state.prevProps.url ||
			props.menu != state.prevProps.menu ){
			let selectedKey = Navigator.getSelectedKey(props.url,props.menu);
			if( selectedKey.length != 0 ){
				return {
					prevProps:props,
					topMenuSelectedKey:selectedKey.i+"",
					mainMenuSelectedKey:selectedKey.i+","+selectedKey.j+","+selectedKey.k,
					mainMenuOpenKeys:[selectedKey.i+","+selectedKey.j],
				};
			}else{
				return {
					prevProps:props,
					topMenuSelectedKey:"0",
					mainMenuSelectedKey:"",
					mainMenuOpenKeys:[]
				};
			}
			
		}
		return null;
	}
	static explode(str){
		let result = str.split("/");
		let newResult = [];
		for( let i in result ){
			if( result[i] != ""){
				newResult.push(result[i]);
			}
		}
		return newResult;
	}
	static getMatch(str1,str2){
		if( str1.length < str2.length ){
			return -1;
		}
		for( let i = 0 ;i != str2.length ;i ++ ){
			if( str1[i] != str2[i] ){
				return -1;
			}
		}
		return str2.length;
	}
	static getSelectedKey(curUrl,menu){
		let url = Navigator.explode(curUrl);
		let match = {
			length:0,
			i:0,
			j:0,
			k:0,
		};
		for( let i in menu ){
			let subMenu = menu[i].children;
			for( let j in subMenu ){
				let leafMenu = subMenu[j].children;
				for( let k in leafMenu ){
					let target = leafMenu[k]
					let targetUrl = Navigator.explode(target.path)
					let targetMatch = Navigator.getMatch(url,targetUrl);
					if( targetMatch > match.length ){
						match = {
							length:targetMatch,
							i:i,
							j:j,
							k:k,
						}
					}
				}
			}
		}
		return match;
	}
	onOpenMainMenu = (openKeys)=>{
		const latestOpenKey = openKeys.find(key => this.state.mainMenuOpenKeys.indexOf(key) === -1);
		if( latestOpenKey && latestOpenKey.length != 0 ){
			this.setState({mainMenuOpenKeys:[latestOpenKey]});
		}
	}
	onSelectTopMenu = (event)=>{
		this.setState({
			topMenuSelectedKey:event.key
		});
	}
	onSelectMainMenu = (event)=>{
		this.props.onSelect(event.item.props.path);
	}
	onSelectDropDown = (event)=>{
		event.item.props.onClick();
	}
	getTopMenu = ()=>{
		const menu = this.props.menu;
		const menuItem = [];
		for( let i in menu ){
			menuItem.push(<Menu.Item key={i}>{menu[i].name}</Menu.Item>);
		}
		return (
			<Menu
				theme="dark"
				mode="horizontal"
				selectedKeys={[this.state.topMenuSelectedKey]}
				onSelect={this.onSelectTopMenu}
				style={{lineHeight:'64px'}}
			>
				{menuItem}
			</Menu>
		);
	}
	getMainMenu = ()=>{
		const menu = this.props.menu[this.state.topMenuSelectedKey];
		let subMenuItem = [];
		for( let i in menu.children ){
			let subMenu = menu.children[i];
			let leafMenuItem = [];
			for( let j in subMenu.children ){
				let leafMenu = subMenu.children[j];
				leafMenuItem.push(
					<Menu.Item key={this.state.topMenuSelectedKey+","+i+","+j} path={leafMenu.path}>{leafMenu.name}</Menu.Item>
				);
			}
			subMenuItem.push(
				<SubMenu key={this.state.topMenuSelectedKey+","+i} title={<span><Icon type={subMenu.icon} />{subMenu.name}</span>}>
					{leafMenuItem}
				</SubMenu>
			);
		}
		return (
			<Menu
	          mode="inline"
	          openKeys={this.state.mainMenuOpenKeys}
	          selectedKeys={[this.state.mainMenuSelectedKey]}
	          style={{ height: '100%', borderRight: 0 }}
	          onOpenChange={this.onOpenMainMenu}
	          onSelect={this.onSelectMainMenu}
	        >
	        	{subMenuItem}
	        </Menu>
		);
	}
	getDropdownMenu = ()=>{
		let menuItem = [];
		for( let i in this.props.login.dropdown ){
			let singleDropdown = this.props.login.dropdown[i];
			menuItem.push(
				<Menu.Item key={i} onClick={singleDropdown.onClick}>{singleDropdown.name}</Menu.Item>
			);
		}
		return (
		<Menu onSelect={this.onSelectDropDown}>
			{menuItem}
		</Menu>
		);
	}
	render = ()=>{
		return (
		<Layout className={style.root}>
			<Header className={style.header}>
			  <h1 className={style.title}>{this.props.title}</h1>
			  <div className={style.empty}/>
			  {this.getTopMenu()}
		      <Dropdown overlay={this.getDropdownMenu()}>
		      	<div><Avatar icon="user" className={style.icon}/><span className={style.user}>{this.props.login.name}</span></div>
		      </Dropdown>
			</Header>
			<Layout className={style.root2}>
				<Sider className={style.sider}>
					{this.getMainMenu()}
				</Sider>
				<Content className={style.content}>
					{this.props.children}
				</Content>
			</Layout>
		</Layout>
		);
	}
}