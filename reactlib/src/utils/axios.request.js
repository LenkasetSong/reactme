/*
 * @Author: your name
 * @Date: 2020-07-30 15:09:31
 * @LastEditTime: 2020-09-16 10:32:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \SubTestReact\src\utils\axios.request.js
 */
import HttpRequest from '@/utils/axios';
import config from '@/config';

const { baseUrl } = config;

const axios = new HttpRequest(baseUrl);

export default axios;
