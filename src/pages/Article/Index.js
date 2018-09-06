import React from 'react';

export default class Index extends React.Component{
	state = {
		counter:5,
	}
	check = ()=>{
		if( this.state.counter == 0 ){
			this.props.history.push('/article/detail1');
		}else{
			this.state.counter--;
			this.setState({});
			setTimeout(this.check,1000);
		}
	}
	componentDidMount = ()=>{
		setTimeout(this.check,1000);
	}
	render = ()=>{
		return <div>{this.state.counter}秒后跳转...</div>;
	}
}