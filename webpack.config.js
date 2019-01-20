const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: './src/client/index.tsx',
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/
			}
		]
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js', '.css']
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist/client'),
		publicPath: '/'
	},
	devServer: {
		disableHostCheck: true,
		contentBase: path.resolve(__dirname, 'dist/client'),
		publicPath: '/',
		port: process.env.PORT || 8888,
		historyApiFallback: {
			rewrites: [
				{from: /^(\/.*)?$/, to: '/'}
			]
		}
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './public/index.html',
			filename: 'index.html'
		})
	]
}
