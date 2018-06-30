import {Switch,Route,Redirect} from 'redva/router';
import dynamic from 'redva/dynamic';
import React from 'react';

let router = [
	{
		path:"/login",
		component:'Login/Login',
	},
	{
		path:"/",
		component:'Layout/Home',
		children:[
			{
				path:"/timeline",
				component:'List/Table',
			},
			{
				path:"/friend",
				component:'Form/FormPage',
			},
			{
				path:"/list",
				component:'list',
				children:[
					{path:"/list/basic",component:'list1'},
					{path:"/list/user/:userId",component:'list2'}
				]
			},
			{
				path:"/counter",
				models:['counter'],
				component:'counter'
			},
			{
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