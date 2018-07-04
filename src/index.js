import React from 'react';
import redva from 'redva';
import redvaLoading from 'redva-loading';
import {Router} from 'redva/router';
import createHistory from 'history/createHashHistory';
import { LocaleProvider , Modal } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import getRouter from '@/utils/router';
import login from '@/models/login';
import ErrorCatch from '@/components/ErrorCatch';

require.context('./models/', true, /\.js$/);
require.context('./pages/', true, /\.js$/);
require.context('./components/', true, /\.js$/);

const app = redva({
	history: createHistory(),
});

app.use(redvaLoading());

app.model(login);

app.router(({history,app})=>{
	const onError = (e)=>{
		console.error(e);
		Modal.error({
			title: '错误',
			content: e.message,
		});
	}
	const router = getRouter(app);
	return (
	<ErrorCatch onError={onError}>
		<LocaleProvider locale={zhCN}>
			<Router history={history}>
				{router}
			</Router>
		</LocaleProvider>
	</ErrorCatch>);
});
app.start('#root');