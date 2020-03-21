const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: path.join(__dirname, '/src/cdfconverter.ts'),
    mode: "development",
    output: {
        filename: 'cdfconverter.js',
        path: `${__dirname}/lib`
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(xslt)$/i,
                use: [
                    'raw-loader'
                ]
            },
            {
                test: /\.(html)$/i,
                use: [
                    'html-loader'
                ]
            },
        ]
    },
    devtool: 'source-map',
    resolve: {
        extensions: [".tsx", ".ts" ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "./src/index.html")
        }),
        new CopyPlugin([
          {  context: 'src', from: 'xslt/*.sef' },
        ]),
    ],
    optimization: {
        minimize: false
    }
};