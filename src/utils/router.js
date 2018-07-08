import {Switch,Route,Redirect} from 'redva/router';
import dynamic from 'redva/dynamic';
import React from 'react';

let router = [
	{
		name:"登录",
		path:"/login",
		component:'Layout/Login',
	},
	{
		name:"首页",
		path:"/",
		component:'Layout/Home',
		children:[
			{
				name:"银行卡列表",
				path:"/card",
				models:['card'],
				component:'Card/List',
			},
			{
				name:"银行卡详情",
				path:"/card/detail",
				models:['card'],
				component:'Card/Detail',
			},
			{
				name:"银行卡列表2",
				path:"/card2",
				models:['card'],
				component:'Card2/List',
			},
			{
				name:"银行卡详情2",
				path:"/card2/detail",
				models:['card'],
				component:'Card2/Detail',
			},
			{
				name:"找不到页面",
				path:"/404",
				component:'notfound',
			}
		]
	}
];

let routerComponent = null;

function analyseComponent(app,router){
	if( router.wrapperComponent ){
		return;
	}
	router.wrapperComponent = dynamic({
      app: app,
      models: () => {
      	if( !router.models ){
      		router.models = [];
      	}
  		return router.models.map(model => {
          return import(`../models/`+model);
        });
      },
      component: async () => {
        let raw = await import(`../pages/`+router.component);
        const Component = raw.default || raw;
        let ChildrenComponent;
        if( router.children && router.children.length != 0 ){
        	if( !router.childrenComponent ){
        		router.childrenComponent = getRouterComponent(app,router.children);
        	}
        	ChildrenComponent = router.childrenComponent;
        }else{
        	ChildrenComponent = null;
        }
        return (props)=>{
        	return React.createElement(Component,props,ChildrenComponent);
        };
      },
    });
    return;
}

function getRouterComponent(app,router){
	let redirectRouter = [];
	for( let i = 0 ; i != router.length ;i ++ ){
		analyseComponent(app,router[i]);
		if( router[i].children && router[i].children.length != 0 ){
			redirectRouter.push(<Redirect exact={true} from={router[i].path} to={router[i].children[0].path} key={"redirect_"+router[i].path}/>);
		}
	}
	return (
		<Switch>
			{redirectRouter}
			{router.map((singleRouter)=>{
				const hasChildren = singleRouter.children && singleRouter.children.length != 0;
				return (<Route exact={!hasChildren} path={singleRouter.path} key={singleRouter.path} component={singleRouter.wrapperComponent}/>);
			})}
			<Redirect to="/404" key={"redirect_404__"}/>
		</Switch>
	);
}

export default function getRouter(app){
	if( routerComponent ){
		return routerComponent;
	}
	routerComponent = getRouterComponent(app,router);
	return routerComponent;
}

let nameMapper = {};

function resetPath(url){
	const urlSeg = url.split('/');
	let newSeg = [];
	for( const i in urlSeg ){
		if( urlSeg[i] != ''){
			newSeg.push(urlSeg[i]);
		}
	}
	return '/'+newSeg.join("/");
}

function calNameMapper(router){
	let result = {};
	for( let i in router ){
		const singleRouter = router[i];
		result[singleRouter.path] = singleRouter.name;
		if( singleRouter.children ){
			let childResult = calNameMapper(singleRouter.children);
			for( let j in childResult ){
				result[j] = childResult[j];
			}
		}
	}
	return result;
}

nameMapper = calNameMapper(router);

export function getRouterName(path){
	path = resetPath(path);
	if( nameMapper[path] ){
		return nameMapper[path];
	}else{
		return "";
	}
}