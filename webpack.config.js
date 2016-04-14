var webpack = require('webpack');
var path = require('path');

module.exports = {
	//页面入口文件配置
	entry: {
		entry: './pie_chart.js', //手机分时图
	},
	output: {
        path: path.join(__dirname, 'out'),  //打包输出的路径
        filename: 'bundle.js',              //打包后的名字
        publicPath: "./out/"                //html引用路径，在这里是本地地址。
    },
	module: //加载器配置
	{
		// loaders: [
		// 	{
		// 		test: /\.css$/,
		// 		loader: 'style!css'
		// 	}
		// ]
	},
	devtool: 'source-map',
	resolve: { //解决方案配置
		root: [
		    path.resolve('./modules/')
		  ],
	    alias: { //模块简称
	        extend: 'tools/extend',
	        jsonp: 'tools/jsonp',
	        datetime: 'tools/datetime'
	    }
	}
};