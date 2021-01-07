import React from 'react';
import PropTypes from 'prop-types';
import EnvSocket from 'test';
import CCESocket from 'ccesocket';
// import styles from './index.module.less';

const test = () => {
  console.log('||||');
  const socket = new EnvSocket({
    wsurl: 'ws://192.168.102.191:8080/sTask',
    callback: (res) => {},
  });
  console.log(socket);
  socket.start((res) => {
    console.log(res);
  });
  console.log(socket);
};

const EnvSocketTest = () => {
  test();
  test();
  test();
  return <></>;
};

EnvSocketTest.defaultProps = {};

EnvSocketTest.propTypes = {};

export default EnvSocketTest;
