const autoprefixer = require( 'autoprefixer' );
const AppCachePlugin = require( 'appcache-webpack-plugin' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const path = require( 'path' );

module.exports = {
	context: __dirname + '/lib',
	devtool: 'sourcemap',
	entry: [
		'./boot'
	],
	output: {
		path: __dirname + '/dist',
		filename: 'app.js'
	},
	module: {
		preLoaders: [
			{ test: /\.jsx?$/, exclude: /bower_components|node_modules|lib\/simperium/, loaders: [ 'eslint-loader' ] }
		],
		loaders: [
			{ test: /\.jsx?$/, exclude: /bower_components|node_modules/, loaders: [ 'babel' ] },
			{ test: /\.json$/, loader: 'json-loader'},
			{ test: /\.scss$/, loader: 'style-loader!css-loader!postcss-loader!sass-loader'},
			{
				test: /\.purs$/,
				loader: 'purs-loader',
				exclude: /node_modules/,
				query: {
					src: [
						path.join('lib', '**', '*.purs'),
						path.join('bower_components', 'purescript-*', 'src', '**', '*.purs')
					]
				}
			}
		]
	},
	resolve: {
		extensions: ['', '.js', '.jsx', '.json', '.purs', '.scss', '.css' ],
		moduleDirectories: [ 'lib', 'node_modules', 'bower_components' ]
	},
	plugins: [
		new AppCachePlugin(),
		new HtmlWebpackPlugin( {
			title: 'Simplenote',
			templateContent: require( './index-builder.js' ),
			inject: false
		} )
	],
	postcss: [ autoprefixer() ]
};
