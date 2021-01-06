// import axios from './axios.request';

import HttpRequest from './axios';

const axios = new HttpRequest();

export function login(data) {
  return axios.request({
    url: '/User/login',
    method: 'post',
    data,
  });
}

export const loginOut = () => {
  return axios.request({
    url: '/User/loginOut',
    method: 'post',
  });
};

export const modifyPassword = (data) => {
  return axios.request({
    url: '/User/modifyPassword',
    method: 'post',
    data,
  });
};
