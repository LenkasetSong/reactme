import axios from 'axios';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { getToken } from './auth';

const { CancelToken } = axios;

class HttpRequest {
  constructor(baseUrl = '') {
    this.baseUrl = baseUrl;
    this.queue = {};
    this.pending = [];
  }

  getInsideConfig() {
    const token = getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const config = {
      baseURL: this.baseUrl,
      timeout: 50000, // request timeout
      withCredentials: false, // 表示跨域请求时是否需要使用凭证
      headers,
      // withCredentials: true
    };
    return config;
  }

  destroy(url) {
    delete this.queue[url];
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }

  removePending(flagUrl, f) {
    if (this.pending.indexOf(flagUrl) !== -1) {
      if (f) {
        f(); // 执行取消操作
      } else {
        this.pending.splice(this.pending.indexOf(flagUrl), 1); // 把这条记录从数组中移除
      }
    } else if (f) {
      this.pending.push(flagUrl);
    }
  }

  // TODO 配置拦截

  interceptors(instance, url) {
    // 请求拦截
    instance.interceptors.request.use(
      (config) => {
        // 防止post方式重复提交
        let newConfig = config;
        if (config.method !== 'get') {
          const cancelToken = new CancelToken((c) => {
            // let flagUrl = this.baseUrl + config.url + '&' + config.method;
            const flagUrl = `${this.baseUrl}${config.url}&${config.method}`;
            this.removePending(flagUrl, c);
          });

          newConfig = { cancelToken, ...config };
        }
        NProgress.start(); // 顶部加载条开始
        if (!Object.keys(this.queue).length) {
          // Spin.show()
        }
        // 判断url
        this.queue[url] = true;
        return newConfig;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截 需根据后端的响应结构进行配置
    instance.interceptors.response.use(
      (response) => {
        NProgress.done(); // 顶部加载条结束
        this.destroy(url);
        if (response.data.success) {
          return response.data;
        }
        // 这里是返回状态码200时，自定义的错误
        return Promise.reject(response.data);
      },
      (error) => {
        NProgress.done(); // 顶部加载条结束
        if (error.response) {
          const { status } = error.response;
          switch (true) {
            case status === 401:
              // 提示授权
              // message.error('未授权，请先登录！');
              break;
            case status === 500:
              // 提示授权
              // message.error('500, 网络错误');
              break;
            case status === 504:
              // 提示授权
              // message.error('504, 网关超时');
              break;
            default:
            // message.error(
            //   error.response.data.msg || error.response.data.message
            // );
          }
        } else if (error.request) {
          // message.error('服务器错误');
        }
        this.pending = [];
        // this.distroy(url);
        return Promise.reject(error);
      }
    );
  }

  request(options) {
    const instance = axios.create();
    const newOptions = Object.assign(this.getInsideConfig(), options);
    // this.interceptors(instance, newOptions.url);
    return instance(newOptions);
  }
}
export default HttpRequest;
