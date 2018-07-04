import React from 'react';
import { Button } from 'antd';
import {connect} from 'redva';
import styles from './counter.css';

class Counter extends React.Component{
	onClick = ()=>{
		this.props.dispatch({
	      type: 'counter/inc',
	    });
	}
	onClick2 = ()=>{
		this.props.dispatch({
			type:'counter/check'
		});
	}
	render = ()=>{
		return (
			<div>
				<div>{this.props.counter}</div>
				<Button onClick={this.onClick}>+1</Button>
				<Button onClick={this.onClick2}>+2</Button>
				<p className={styles.text}>Hello Antd Admin2</p>
			</div>
		);
	}
}

export default connect(({counter}) => {
  return { 
    counter: counter 
  }
})(Counter);
