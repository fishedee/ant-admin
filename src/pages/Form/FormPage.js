import React from 'react';
import PageHeader from '@/components/PageHeader';
import Form from './Form';

export default class FormPage extends React.PureComponent{
	render(){
		return (
			<PageHeader title="表单">
				<Form/>
			</PageHeader>
		);
	}
}