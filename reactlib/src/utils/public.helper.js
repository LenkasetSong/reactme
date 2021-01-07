/*
 * @Author: your name
 * @Date: 2020-08-27 15:33:48
 * @LastEditTime: 2020-09-11 16:07:11
 * @LastEditors: Please set LastEditors
 * @Description: 公用函数库
 * @FilePath: \EdgeConfig\src\utils\publicFunc.js
 */
/**
 * 获取地址栏 ?参数，返回键值对对象
 */
export const getQuery = () => {
  const { href } = window.location;
  const query = href.split('?');
  if (!query[1]) return {};

  const queryArr = decodeURI(query[1]).split('&');
  const queryObj = queryArr.reduce((prev, next) => {
    const item = next.split('=');
    return { ...prev, [item[0]]: item[1] };
  }, {});
  return queryObj;
};

export const test = () => {
  return '';
};
