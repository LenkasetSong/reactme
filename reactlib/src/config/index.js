/*
 * @Author: your name
 * @Date: 2020-10-12 11:14:30
 * @LastEditTime: 2020-10-13 10:05:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \TDOA\src\config\index.js
 */
export default {
  baseUrl:
    process.env.NODE_ENV === 'production'
      ? window.projConfig.commons.apiBaseUrl
      : 'http://192.168.102.191:10000',
  wsUrl:
    process.env.NODE_ENV === 'production'
      ? window.projConfig.commons.wsBaseUrl
      : 'ws://192.168.102.191:8080/STask',
  projectName: 'commons micro app',
  // eslint-disable-next-line no-underscore-dangle
  routerBaseName: window.__POWERED_BY_QIANKUN__
    ? window.projConfig.commons.routeBaseName
    : '/',
};
