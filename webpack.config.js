const path = require('path');
const args = require('minimist')(process.argv.slice(2));
const htmlWebpackPlugin = require('html-webpack-plugin');
const cleanWebpackPlugin = require('clean-webpack-plugin');

const isDevelopment = (args.mode == 'development');

const theme = {
}
module.exports = {
	entry:[
		'./src/index.js',
		'./public/favicon.ico'
	],

	output:{
		filename:'[name]-[hash].js',
		chunkFilename: '[name]-[contenthash].js',
		path:path.resolve(__dirname,'dist')
	},

	devtool: '',
	
	resolve:{
		alias: {
	      '@': path.resolve(__dirname,'src'),
	      'art-template':path.resolve(__dirname,'node_modules/art-template/lib/template-web.js')
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
						["import", { "libraryName": "antd", "style": true }]
					]
				}
			},
			{
				test:/\.less$/,
				exclude:/node_modules/,
				use:[
					{loader:'style-loader'},
					{loader:'css-loader',options: { importLoaders: 1 ,modules:true}},
					{loader:'less-loader',options:{modifyVars:theme,javascriptEnabled: true}},
				]
			},
			{
				test:/\.less$/,
				include:/node_modules/,
				use:[
					{loader:'style-loader'},
					{loader:'css-loader',options: { importLoaders: 1}},
					{loader:'less-loader',options:{modifyVars:theme,javascriptEnabled: true}},
				]
			},
			{
				test:/\.css$/,
				use:[
					{loader:'style-loader'},
					{loader:'css-loader'}
				]
			},
			{
				test:/public\/.*$/,
				loader:'file-loader',
				options:{
					name:"[name].[ext]"
				}
			}
		]
	},

	plugins:[
		new cleanWebpackPlugin(['dist']),
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
		host: '0.0.0.0',
    	disableHostCheck: true,
		compress: true,
		proxy:{
			"/": {
				target:"http://localhost:3001",
				changeOrigin: true
			}
		}
	}
}