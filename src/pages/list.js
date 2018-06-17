import React from 'react';

export default class List extends React.PureComponent{
	render(){
		console.log(this.props.children);
		return (<div>This is List Page{this.props.children}</div>);
	}
}