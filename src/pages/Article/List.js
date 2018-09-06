import React from 'react';
import {Radio} from 'antd';

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

export default class List extends React.Component{
	onChange = (e)=>{
		var target = e.target.value;
		this.props.history.push(target);
	}
	render = ()=>{
		var pathname = this.props.location.pathname;
		var pathMap = [
			{id:'/article/detail1',name:'文章详情1'},
			{id:'/article/detail2',name:'文章详情2'},
		];
		return (
			<div>
				<div>
					<RadioGroup 
						value={pathname}
						buttonStyle="solid"
						style={{marginBottom:'16px'}}
						onChange={this.onChange}>
						<RadioButton value={pathMap[0].id}>{pathMap[0].name}</RadioButton>
						<RadioButton value={pathMap[1].id}>{pathMap[1].name}</RadioButton>
					</RadioGroup>
				</div>
				{this.props.children}
			</div>
		);
	}
}