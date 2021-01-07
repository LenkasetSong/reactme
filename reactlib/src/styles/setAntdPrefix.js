/*
 * @Author: your name
 * @Date: 2020-09-21 15:50:53
 * @LastEditTime: 2020-09-24 15:27:01
 * @LastEditors: Please set LastEditors
 * @Description: 针对静态方法（message。modal，confirm之类的），修改css前缀
 * @FilePath: \Main\src\styles\setAntdPrefix.js
 */
import { message, notification, Modal } from 'antd';
import { antdPrefix } from '../../package.json';

export default function () {
  message.config({
    prefixCls: `${antdPrefix}-message`,
  });

  Modal.config({
    rootPrefixCls: `${antdPrefix}`,
  });

  notification.config({
    prefixCls: `${antdPrefix}-notification`,
  });
}
