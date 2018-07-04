import React from 'react';
import { Form ,Row , Col,Button ,Icon} from 'antd';
import styles from './index.less';
import DefaultForm from '@/components/DefaultForm';

const FormItem = Form.Item;

@DefaultForm
export default class StandardQuery extends React.Component{

	handleSearch = (e)=>{
		const { form } = this.props;
		e.preventDefault();
		form.validateFields((err, fieldsValue) => {
      		if (err) {
      			return;
      		}
      		this.props.onSubmit(fieldsValue);
      	})
	}

	handleFormReset = ()=>{
		const { form } = this.props;
		form.resetFields();
		this.props.onSubmit({});
	}

	renderForm = ()=>{
		const columns = this.props.columns;
		const { getFieldDecorator } = this.props.form;
		let formList = [];
		for( let i in columns ){
			let singleColumn = columns[i];
			formList.push(
				<Col md={8} sm={24} key={i}>
					<FormItem label={singleColumn.title}>
						{getFieldDecorator(singleColumn.field)(singleColumn.render())}
					</FormItem>
				</Col>
			);
		}
		return (
	      <Form onSubmit={this.handleSearch} layout="inline">
	        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
	          {formList}
	        </Row>
	        <div style={{ overflow: 'hidden' }}>
	          <span style={{ float: 'right', marginBottom: 24 }}>
	            <Button type="primary" htmlType="submit">
	              查询
	            </Button>
	            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
	              重置
	            </Button>
	          </span>
	        </div>
	      </Form>
	    );
	}

	render = ()=>{
		return (<div className={styles.tableListForm}>{this.renderForm()}</div>);
	}
}
