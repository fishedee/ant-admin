const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry:'./src/index.js',

	output:{
		filename:'[name]-[hash].js',
		chunkFilename: '[name]-[contenthash].js',
		path:path.resolve(__dirname,'dist')
	},

	resolve:{
		alias: {
	      '@': path.resolve(__dirname,'src')
	    }
	},

	module:{
		rules:[
			{
				test:/\.js$/,
				exclude:/node_modules/,
				loader:'babel-loader',
				options:{
					presets:['env','react','stage-0'],
					plugins:[
						'transform-decorators-legacy',
						'transform-runtime',
						["import", { "libraryName": "antd", "style": "css" }]
					]
				}
			},
			{
				test:/\.less$/,
				use:[
					{loader:'style-loader'},
					{loader:'css-loader',options: { importLoaders: 1 ,modules:true}},
					{loader:'less-loader'},
				]
			},
			{
				test:/\.css$/,
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