/*
 * @Author: your name
 * @Date: 2020-07-23 14:51:35
 * @LastEditTime: 2020-09-25 17:47:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \dcfe-framework\craco.config.js
 */
// Create React App Configuration Override is an easy and comprehensible configuration layer for create-react-app. https://github.com/gsoft-inc/craco

const CracoAntDesignPlugin = require('craco-antd');
const CracoLessPlugin = require('craco-less');
const CracoAlias = require('craco-alias');
const path = require('path');
const { whenDev } = require('@craco/craco');
const { name, antdPrefix } = require('./package');

module.exports = {
  eslint: {
    enable: true,
    mode: 'file',
  },
  plugins: [
    /* antd组件按需加载&样式覆盖等 */
    {
      plugin: CracoAntDesignPlugin,
      options: {
        customizeTheme: {
          '@ant-prefix': antdPrefix,
        },
        customizeThemeLessPath: path.join(
          __dirname,
          'src/styles/antd.theme.less'
        ),
      },
    },
    /* 别名设置 */
    {
      plugin: CracoAlias,
      options: {
        source: 'options',
        baseUrl: './',
        aliases: {
          '@': './src',
        },
      },
    },
    /* 支持less module */
    {
      plugin: CracoLessPlugin,
      options: {
        cssLoaderOptions: {
          modules: { localIdentName: '[local]_[hash:base64:5]' },
        },
        // eslint-disable-next-line no-unused-vars
        modifyLessRule(lessRule, _context) {
          // eslint-disable-next-line no-param-reassign
          lessRule.test = /\.(module)\.(less)$/;
          // eslint-disable-next-line no-param-reassign
          lessRule.exclude = path.join(__dirname, 'node_modules');
          return lessRule;
        },
      },
    },
  ],
  webpack: {
    configure: (config) => {
      // const config = { ...webpackConfig };
      // 微应用的包名，这里与主应用中注册的微应用名称一致
      config.output.library = `${name}`;
      // 将你的 library 暴露为所有的模块定义下都可运行的方式
      config.output.libraryTarget = 'umd';
      // 按需加载相关，设置为 webpackJsonp_VueMicroApp 即可
      config.output.jsonpFunction = `webpackJsonp_${name}`;

      config.output.globalObject = 'window';

      config.module.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      });

      return config;
    },
  },
  devServer: whenDev(() => ({
    disableHostCheck: true,
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  })),
  // devServer: (devServerConfig) => {
  //   return {
  //     ...devServerConfig,
  //     // 服务开启gzip
  //     compress: true,
  //     proxy: {
  //       '/api': {
  //         target: 'https://localhost:9001/',
  //         changeOrigin: true,
  //         xfwd: false,
  //       },
  //     },
  //   };
  // },
};
