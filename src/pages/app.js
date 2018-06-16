import React from 'react';
import { Button } from 'antd';
import {connect} from 'redva';
import styles from './app.css';

class App extends React.PureComponent{
	onClick = ()=>{
		this.props.dispatch({
	      type: 'counter/inc',
	    });
	}
	render = ()=>{
		return (
			<div>
				<div>{this.props.counter}</div>
				<Button onClick={this.onClick}>+1</Button>
				<p className={styles.text}>Hello Antd Admin2</p>
			</div>
		);
	}
}

export default connect(state => {
  return { 
    counter: state.counter 
  }
})(App);
