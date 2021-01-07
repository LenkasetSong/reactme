/* eslint-disable no-console */
/*
 * @Author: your name
 * @Date: 2020-07-28 09:52:11
 * @LastEditTime: 2020-10-13 10:04:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \SubTestReact\src\index.js
 */
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './public-path';
import * as serviceWorker from './serviceWorker';
import setAntdPrefix from './styles/setAntdPrefix';

setAntdPrefix();

function render(props) {
  const { container } = props;
  ReactDOM.render(
    <App />,
    container
      ? container.querySelector('#root')
      : document.querySelector('#root')
  );
}

function storeTest(props) {
  props.onGlobalStateChange(
    (value, prev) =>
      console.log(`[onGlobalStateChange - ${props.name}]:`, value, prev),
    true
  );
  props.setGlobalState({
    ignore: props.name,
    user: {
      name: props.name,
    },
  });
}

// eslint-disable-next-line no-underscore-dangle
if (!window.__POWERED_BY_QIANKUN__) {
  render({});
}

export async function bootstrap() {
  console.log('[sub-test-react] react app bootstraped');
}

export async function mount(props) {
  console.log('[sub-test-react] props from main framework', props);
  storeTest(props);
  render(props);
}

export async function unmount(props) {
  console.log('[sub-test-react] sub react app %c unmounted ', 'color: red;');
  const { container } = props;
  ReactDOM.unmountComponentAtNode(
    container
      ? container.querySelector('#root')
      : document.querySelector('#root')
  );
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
