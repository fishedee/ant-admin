import React from 'react';
import style from './index.less';

export default class PageHeader extends React.PureComponent{
	render(){
		return (<div className={style.root}>
			<h1 className={style.title}>{this.props.title}</h1>
			<div className={style.content}>{this.props.children}</div>
		</div>);
	}
}