/* eslint-disable no-shadow */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import classNames from 'classnames';
import { Layout } from 'antd';
import routes from '@/routes';
// import { getToken } from '@/utils/auth';
import styles from './layout.module.less';

const { Content } = Layout;

const BasicLayout = (props) => {
  const { history } = props;

  const { auth } = JSON.parse(localStorage.getItem('user')) || '';

  // useEffect(() => {
  //   if (!getToken()) {
  //     history.push('/login');
  //   }
  // }, []);

  return (
    <Layout className={styles.app} style={{ height: '100%' }}>
      <Content>
        <Layout className={styles.layoutWrapper}>
          <div
            className={classNames(styles.contentCon, styles.drawerCompatible)}
          >
            <Switch>
              {routes.map((item) => {
                return (
                  <Route
                    key={item.path}
                    path={item.path}
                    exact={item.exact}
                    render={(props) => {
                      if (!auth) {
                        return <item.component {...props} />;
                      }
                      if (item.auth && item.auth.includes(auth)) {
                        return <item.component {...props} />;
                      }
                      return <Redirect to="/403" {...props} />;
                    }}
                  />
                );
              })}
              <Redirect to="/404" />
            </Switch>
          </div>
        </Layout>
      </Content>
    </Layout>
  );
};

BasicLayout.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

export default withRouter(BasicLayout);
