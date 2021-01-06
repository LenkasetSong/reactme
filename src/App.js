import React from 'react';
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import AsyncLoadable from './AsyncLoadable.jsx';
import logo from './logo.svg';
import './App.css';

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
const Login = AsyncLoadable(() =>
  import(/* webpackChunkName: 'login' */ './views/Login')
);

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <Router basename="/reactme">
        <Switch>
          <Route path="/" exact render={() => <Redirect to="/index" />} />
          <Route path="/403" component={View403} />
          <Route path="/404" component={View404} />
          <Route path="/500" component={View500} />
          <Route path="/login" component={Login} />
          <Route component={BasicLayout} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
