const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const BROWSER_ENV_PREFIX = 'BROWSER_';

module.exports = {
	entry: './src/client/index.tsx',
	module: {
		rules: [
			{
				test: /\.scss$/,
				use: [
					'style-loader',
					'css-modules-ts-definitions-loader',
					{
						loader: 'css-loader',
						options: {
							modules: true,
							camelCase: true,
							localIdentName: '[name]__[local]--[hash:base64:5]'
						}
					},
					'sass-loader'
				]
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
		},
		before(app) {
			app.get('/env.js', (_req, res) => {
				const envStr = Object.keys(process.env)
					.filter(key => key.startsWith(BROWSER_ENV_PREFIX))
					.map(key => `${key.substr(BROWSER_ENV_PREFIX.length)}:'${process.env[key]}'`)
					.join(',');
				res.end(`window.env = {${envStr}}`);
			});
		}
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './public/index.html',
			filename: 'index.html'
		})
	]
}
