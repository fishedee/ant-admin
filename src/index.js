import React from 'react'
import redva from 'redva'
import redvaLoading from 'redva-loading';
import createHistory from 'history/createHashHistory';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';

import App from './pages/app'
import Counter from './models/counter';

require.context('./models/', true, /\.js$/);
require.context('./pages/', true, /\.js$/);
require.context('./components/', true, /\.js$/);

const app = redva({
	history: createHistory(),
});

app.use(redvaLoading());

app.model(Counter);
app.router(({history,app})=>{
	return (
	<LocaleProvider locale={zhCN}>
		<App/>
	</LocaleProvider>);
});
app.start('#root');