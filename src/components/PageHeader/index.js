import React from 'react';
import style from './index.less';
import { Icon } from 'antd';

export default class PageHeader extends React.Component{
	render(){
		return (<div className={style.root}>
			<div className={style.header}>
				{this.props.hasBack?<div className={style.back} onClick={this.props.onBack}><Icon type="left"/>返回</div>:null}
				<h1 className={style.title}>{this.props.title}</h1>
				<div className={style.reload} onClick={this.props.onReload}><Icon type="reload"/></div>
			</div>
			<div className={style.content}>{this.props.children}</div>
		</div>);
	}
}