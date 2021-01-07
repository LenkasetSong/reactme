/*
 * @Description:
 * @Date: 2019-10-14 14:26:15
 * @LastEditTime: 2020-09-10 09:56:59
 */
import axios from '@/utils/axios.request';

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
