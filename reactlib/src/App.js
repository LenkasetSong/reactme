import React from 'react';
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import AsyncLoadable from '@/utils/AsyncLoadable.jsx';
import config from '@/config';

import '@/styles/App.less';
import { ConfigProvider } from 'antd';
import { antdPrefix } from '../package.json';

// 公共模块
const BasicLayout = AsyncLoadable(() =>
  import(/* webpackChunkName: 'default' */ './layout')
);

// 基础页面
const View403 = AsyncLoadable(() =>
  import(/* webpackChunkName: '403' */ './views/Others/403')
);
const View404 = AsyncLoadable(() =>
  import(/* webpackChunkName: '404' */ './views/Others/404')
);
const View500 = AsyncLoadable(() =>
  import(/* webpackChunkName: '500' */ './views/Others/500')
);

const { routerBaseName } = config;

const App = () => (
  <ConfigProvider prefixCls={antdPrefix}>
    <Router basename={routerBaseName}>
      <Switch>
        <Route path="/" exact render={() => <Redirect to="/index" />} />
        <Route path="/403" component={View403} />
        <Route path="/404" component={View404} />
        <Route path="/500" component={View500} />
        <Route component={BasicLayout} />
      </Switch>
    </Router>
  </ConfigProvider>
);

export default App;
