// import axios from './axios.request';

import HttpRequest from './axios';

const axios = new HttpRequest();

export function fetchList(query) {
  return axios.request({
    url: '/article/list',
    method: 'get',
    params: query,
  });
}

export function fetchArticle(id) {
  return axios.request({
    url: '/article/detail',
    method: 'get',
    params: { id },
  });
}

export function fetchPv(pv) {
  return axios.request({
    url: '/article/pv',
    method: 'get',
    params: { pv },
  });
}

export function createArticle(data) {
  return axios.request({
    url: '/article/create',
    method: 'post',
    data,
  });
}

export function updateArticle(data) {
  return axios.request({
    url: '/article/update',
    method: 'post',
    data,
  });
}
