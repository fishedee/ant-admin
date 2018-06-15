import React from 'react';
import { LocaleProvider, Button, message } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';

export default class App extends React.PureComponent{
	onClick = ()=>{
		message.info("你点我了");
	}
	render = ()=>{
		return (
			<LocaleProvider locale={zhCN}>
				<Button onClick={this.onClick}>点我</Button>
			</LocaleProvider>
		);
	}
}