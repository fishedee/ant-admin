export default [
	{
		name:"用户管理",
		children:[
			{
				name:"管理1",
				icon:"user",
				children:[
					{name:"朋友",path:"/friend"},
					{name:"时间线",path:"/timeline"}
				]
			},
			{
				name:"管理2",
				icon:"laptop",
				children:[
					{name:"计数器",path:"/counter"},
					{name:"列表",path:"/list"}
				]
			}
		]
	},
	{
		name:"用户管理2",
		children:[
			{
				name:"管理3",
				icon:"user",
				children:[
					{name:"朋友",path:"/friend/123"},
					{name:"时间线",path:"/timeline2"}
				]
			},
			{
				name:"管理4",
				icon:"laptop",
				children:[
					{name:"计数器",path:"/counter2"},
					{name:"列表",path:"/list2"}
				]
			}
		]
	}
]