const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry:'./src/index.js',

	output:{
		filename:'[name]-[hash].js',
		chunkFilename: '[name]-[contenthash].js',
		path:path.resolve(__dirname,'dist')
	},

	module:{
		rules:[
			{
				test:/\.js$/,
				exclude:/node_modules/,
				loader:'babel-loader',
				options:{
					presets:['env','react','stage-0'],
					plugins:['transform-runtime',["import", { "libraryName": "antd", "style": "css" }]]
				}
			},
			{
				test:/\.css$/,
				include:[
					path.resolve(__dirname,"src")
				],
				use:[
					{loader:'style-loader'},
					{loader:'css-loader',options:{modules:true}}
				]
			},
			{
				test:/\.css$/,
				include:[
					path.resolve(__dirname,"node_modules")
				],
				use:[
					{loader:'style-loader'},
					{loader:'css-loader'}
				]
			}
		]
	},

	plugins:[
		new htmlWebpackPlugin({
			filename:'index.html',
			title:'antd admin',
			template:'./src/index.html',
		}),
	],

	optimization:{
		splitChunks: {
			chunks: 'all',
			minSize: 1,
		    minChunks: 1,
		    maxAsyncRequests: 5,
		    maxInitialRequests: 3,
		    automaticNameDelimiter: '-',
		    name: true,
		    cacheGroups: {
		        vendors: {
		        	name:'vendors',
		            test: /[\\/]node_modules[\\/]/,
		            priority: -10
		        }
		    }
		},
		runtimeChunk:{
			name:'webpack'
		}
	},
	

	devServer:{
		compress: true,
		proxy:{
			"/": {
				target:"http://localhost:8585",
				changeOrigin: true
			}
		}
	}
}