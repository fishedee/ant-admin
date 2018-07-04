import React from 'react';

export default class Home extends React.Component{
	render(){
		return (<div>This is Home Page{this.props.children}</div>);
	}
}