<!--
 * @Author: your name
 * @Date: 2020-11-19 11:18:24
 * @LastEditTime: 2020-11-19 13:56:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Commons\README.md
-->
## Searchlight公共组件项目

该项目用于开发、提交、发布Searchlight项目公共组件。后续涉及到的公用组件都在此项目中进行开发并编写Demo。



<br />

# 组件编写说明
- 创建组件在./src/Components中新建文件夹，并添加组件文件
  
- 在./src/views/Demos中编写测试页面
  
- 在./src/views/StartPage页面中直接引入或路由到Demo测试页面
  
- 建议增加文件头，方便后期维护
  
- 编写Demo时尽量覆盖所有接口，易于他人参考使用
  
  <br />

# 项目结构

```
├── build  项目构建配置
├── public  入口文件
├── README.md  help
├── craco.config.js craco配置文件，可添加额外的webpack配置
├── .eslintrc.js 项目的全局eslint配置
├── .prettierrc.js 项目的全局prettier配置
├── .stylelintrc.js 项目的全局stylelint配置
├── .gitignore 项目git版本忽略文件列表
├── package.json
└── src
    ├── index.js  项目入口文件
    ├── App.js  应用主体，路由页
    ├── api  接口地址列表
    ├── assets  项目静态资源
    ├── components  全局组件
    ├── view  页面组件
    ├── layout  框架布局
    ├── utils  工具函数
    |     ├── AsyncLoadable.jsx  React组件异步加载
    |     ├── axios / axios.request.js 基于axios的异步请求封装
    |     └── auth.js 用户权限存取
    ├── routes  路由（与侧边menu）配置表
    └── styles  全局项目样式文件
```
