
var webpack = require('webpack');
var path = require('path');
var { CleanWebpackPlugin } = require('clean-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development', // 设置mode('production', 'development'),会将  process.env.NODE_ENV === 'development',命令中已配置 此处可不用配置
    entry: {
        index: './src/index.js'
    },
    output: {
        path          : __dirname + '/dist',
        filename      : '[name].[hash:8].js',
        library       : 'es6-es5-template',       // 指定类库名,主要用于直接引用的方式(比如使用script 标签)
        libraryExport : "default",                // 对外暴露default属性，就可以直接调用default里的属性
        globalObject  : 'this',                   // 定义全局变量,兼容node和浏览器运行，避免出现"window is not defined"的情况
        libraryTarget : 'umd'                     // 定义打包方式Universal Module Definition,同时支持在CommonJS、AMD和全局变量使用
    },
    //插件依赖
    plugins: [
        //清除前一次打包指定的文件夹
        new CleanWebpackPlugin(),
        // 在命令行进行友好提示
        new FriendlyErrorsWebpackPlugin(),
        // ProvidePlugin 可以将模块作为一个变量，被webpack在其他每个模块中引用。只有你需要使用此变量的时候，这个模块才会被 require 进来。
        new webpack.ProvidePlugin({ _: ['lodash'] }),
        new HtmlWebpackPlugin({
            title: 'index',
            filename: 'index.html', // 输出的文件名
            minify: { //压缩HTML文件
                removeComments: true, //移除HTML中的注释
                collapseWhitespace: false //删除空白符与换行符
            }, // 移除注释
            template: 'src/index.html' // 我们原来的index.html路径，作为模板
        })
    ],
    module: {
        rules: [{
            //处理js文件
            exclude: /node_modules/,     // 不匹配选项（优先级高于test和include）
            test: /\.js$/,
            include: [
                path.resolve(__dirname, 'src')
            ],
            use: [{
                loader: "babel-loader",
                // options: {
                //     //使用env预设来处理es6语法的js文件
                //     presets: ['env']
                // }
            }],
            // exclude: [
            //     path.resolve(__dirname, './node_modules')
            // ]
        }, {
            test: /\.less$/,
            use: [{
                loader: "style-loader"
            }, {
                loader: "css-loader"
            }, {
                loader: "less-loader"
            }]
        }, {
            test: /\.(jpg|png|gif|bmp|jpeg)$/, //正则表达式匹配图片规则
            use: [{
                loader: 'url-loader',
                options: {
                    publicPath: './',
                    limit: 10000, //限制打包图片的大小：
                    //如果大于或等于10000Byte，则按照相应的文件名和路径打包图片；如果小于10000Byte，则将图片转成base64格式的字符串。
                    name: 'image/[name].[hash:8].[ext]', //css中的images图片将会打包在build/image下;
                }
            }]
        },
        {
            test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/, //处理媒体文件
            loader: 'url-loader',
            options: {
                publicPath: './',
                limit: 10000,
                name: 'media/[name].[hash:8].[ext]'
            }
        },
        {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,//处理字体文件
            loader: 'url-loader',
            options: {
                publicPath: './',
                limit: 10000,
                name: 'fonts/[name].[hash:8].[ext]'
            }
        }, {
            test: /\.vue$/,
            loader: "vue-loader"
        },]
    },
    //这里我们可以剔除掉一些通用包,自己的包不打包这些类库,需要用户环境来提供
    externals: {
        vue: "vue",
        axios: "axios"
    }
} 
