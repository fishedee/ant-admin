import React from 'react';
import redva from 'redva';
import redvaLoading from 'redva-loading';
import {Router} from 'redva/router';
import createHistory from 'history/createHashHistory';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import getRouter from './utils/router';

require.context('./models/', true, /\.js$/);
require.context('./pages/', true, /\.js$/);
require.context('./components/', true, /\.js$/);

const app = redva({
	history: createHistory(),
});

app.use(redvaLoading());

app.router(({history,app})=>{
	const router = getRouter(app);
	return (
	<LocaleProvider locale={zhCN}>
		<Router history={history}>
			{router}
		</Router>
	</LocaleProvider>);
});
app.start('#root');