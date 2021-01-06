/*
 * @Author: your name
 * @Date: 2020-07-23 14:57:11
 * @LastEditTime: 2020-08-04 13:52:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \dcfe-framework\mock-api\app.js
 */
const express = require('express');
const apiMocker = require('connect-api-mocker');

const port = 9001;
const app = express();

// 如果需要设置跨域
const cors = require('cors');

app.use(cors());

app.use('/api', apiMocker('mock'));

// eslint-disable-next-line no-console
console.log(`Mock API Server is up and running at: http://localhost:${port}`);

app.listen(port);
