import React from 'react';
import {Form,Button} from 'antd';
import DefaultForm from '@/components/DefaultForm';

const FormItem = Form.Item;

@DefaultForm
export default class StandardForm extends React.PureComponent{
	handleSubmit = (e)=>{
		const { form } = this.props;
		e.preventDefault();
		form.validateFields((err, fieldsValue) => {
      		if (err) {
      			return;
      		}
      		this.props.onSubmit(fieldsValue);
      	})
	}

	renderFormItem = ()=>{
		const { form } = this.props;
		const { getFieldDecorator } = form;
		const formItemLayout = {
		  labelCol: {
		    xs: { span: 24 },
		    sm: { span: 4 },
		  },
		  wrapperCol: {
		    xs: { span: 24 },
		    sm: { span: 20 },
		  },
		};
		const tailFormItemLayout = {
		  wrapperCol: {
		    xs: {
		      span: 24,
		      offset: 0,
		    },
		    sm: {
		      span: 16,
		      offset: 8,
		    },
		  },
		};
		let columns = this.props.columns;
		let formItem = [];
		for( let i in columns ){
			let singleColumn = columns[i];
			formItem.push(
				<FormItem {...formItemLayout}
		          label={singleColumn.title}
		          key={singleColumn.field}
		        >
		        	{getFieldDecorator(singleColumn.field,{rules:singleColumn.rules})(singleColumn.render())}
		        </FormItem>
			);
		}
		if( this.props.onSubmit ){
			formItem.push(
				<FormItem {...tailFormItemLayout} key={"__submit"}>
					<Button type="primary" htmlType="submit">提交</Button>
				</FormItem>
			);
		}
		return formItem;
	}
	render = ()=>{
		return (
			<Form onSubmit={this.handleSubmit}>
				{this.renderFormItem()}
			</Form>
		);
	}
}