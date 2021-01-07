/*
 * @Author: your name
 * @Date: 2020-08-18 15:26:26
 * @LastEditTime: 2020-10-13 10:03:13
 * @LastEditors: Please set LastEditors
 * @Description: 打包后项目配置文件
 * @FilePath: \Main\public\projConfig.js
 */

{
  const config = {
    // 应用api服务器地址
    apiBaseUrl: 'http://192.168.102.191:10000',
    // 应用webSocket服务器地址
    wsBaseUrl: 'ws://192.168.102.191:8080/STask',
    // 项目名称，用于界面内各处标志展示
    projectName: 'commons',
    // 子应用在主应用中的路由active地址
    routeBaseName: '/microGroup1/commons',
  };

  // window为整个微前端应用的总体配置变量对象
  if (!window.projConfig) {
    window.projConfig = {
      // demo 是针对于当前应用的一个key，必须不与其他主子应用重复，所以约定为当前子应用的name，同package.json文件中的name
      commons: config,
    };
  } else if (!window.projConfig.commons) {
    window.projConfig.commons = config;
  } else {
    // eslint-disable-next-line no-console
    console.log(
      '[Project Config] commons extends project config from %c%s',
      'color: orange;',
      'main app.'
    );
  }
}
