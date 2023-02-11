const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const ESLintPlugin = require('eslint-webpack-plugin');

const { DEV, DEBUG } = process.env;

process.env.BABEL_ENV = DEV ? 'development' : 'production';
process.env.NODE_ENV = DEV ? 'development' : 'production';

module.exports = {
 entry: './src/index.tsx',
 output: {
  path: path.join(__dirname, '/dist'),
  filename: 'bundle.js',
  clean: true,
 },
 devServer: {
  port: 8080,
 },
 mode: DEV ? 'development' : 'production',
 devtool: DEV && 'source-map',
 module: {
  rules: [
   {
    test: /\.jsx?$/,
    exclude: /node_modules/,
    loader: 'babel-loader',
   },
   {
    test: /\.tsx?$/,
    exclude: /node_modules/,
    loader: 'ts-loader',
   },
   {
    test: /\.css$/,
    use: ['style-loader', 'css-loader'],
   },
   {
    test: /\.less$/,
    use: [
     'style-loader',
     'css-loader',
     {
      loader: 'less-loader',
      options: {
       lessOptions: {
        javascriptEnabled: true,
       },
      },
     },
    ],
   },
   {
    test: /\.(sass|scss)$/,
    use: [
     {
      loader: MiniCssExtractPlugin.loader,
     },
     {
      loader: 'css-loader',
      options: {
       importLoaders: 2,
       sourceMap: !!DEV,
      },
     },
     {
      loader: 'sass-loader',
      options: {
       sourceMap: !!DEV,
      },
     },
    ],
   },
   {
    test: /\.png/,
    type: 'asset/resource',
   },
   {
    test: /\.(woff|woff2|eot|ttf|otf)$/i,
    type: 'asset/resource',
   },
   {
    test: /\.(csv|tsv)$/i,
    use: ['csv-loader'],
   },
   {
    test: /\.xml$/i,
    use: ['xml-loader'],
   },
  ],
 },
 optimization: {
  minimizer: [
   new TerserPlugin({
    parallel: false,
    terserOptions: {
     output: {
      comments: false,
     },
    },
   }),
  ],
  minimize: !DEV,
  splitChunks: {
   minSize: 500000,
   cacheGroups: {
    vendors: false,
   },
  },
 },
 resolve: {
  modules: ['node_modules'],
  extensions: ['.json', '.js', '.jsx', '.ts', '.tsx', '.less', 'scss'],
 },
 plugins: [
  new HtmlWebpackPlugin({
   template: path.join(__dirname, '/src/public/index.html')
  }),
  DEBUG && new BundleAnalyzerPlugin(),
  new MiniCssExtractPlugin({
   filename: '[name].css',
   chunkFilename: '[name].css',
  }),
  new ESLintPlugin(),
  new ForkTsCheckerWebpackPlugin(),
 ].filter(Boolean),
};