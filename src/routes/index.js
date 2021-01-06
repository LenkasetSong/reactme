import AsyncLoadable from '../AsyncLoadable.jsx';

// 首页
const Home = AsyncLoadable(() =>
  import(/* webpackChunkName: 'index' */ '../views/Home/index')
);

const routes = [
  {
    path: '/home',
    exact: true,
    name: 'Home',
    component: Home,
    auth: [1],
  },
];

export default routes;
