import React from 'react';

export default class HomeRedirect extends React.Component{
	componentDidMount = ()=>{
		this.props.history.push("/order");
	}
	render(){
		return null;
	}
}