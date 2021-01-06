import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useRequest } from "ahooks";
import { login } from "../../api/account";
import { setToken, getToken } from "../../api/auth";
import style from "./login.module.less";

const Login = (props) => {
  const { history } = props;
  const [loading, setLoading] = useState(false);

  const handleSubmitFinish = (res) => {
    // 暂时模拟用户登录信息
    switch (res.username) {
      case "admin":
        res.auth = 0;
        break;
      default:
        res.auth = 1;
    }

    localStorage.setItem("user", JSON.stringify(res));

    const user = {
      account: res.username,
      password: res.password,
    };
    run(user);
    setLoading(true);
  };

  const { run } = useRequest((user) => login(user), {
    manual: true,
    onSuccess: (ret) => {
      setToken(ret.data.data.token); // TODO 未配置拦截原因
      setLoading(false);
      history.push("/");
    },
    onError: (/* ret */) => {
      setLoading(false);
    },
  });

  useEffect(() => {
    // 判断已登录之后，直接跳转到主页
    if (getToken()) {
      history.push("/");
    } else {
    }
    return () => {};
  }, []);

  return (
    <div className={style.container}>
      <div className={style.loginForm}>
        <h3>管理平台</h3>
        <button
          onClick={() => {
            handleSubmitFinish({ username: "admin", password: "142857" });
          }}
        >
          登录
        </button>
      </div>
    </div>
  );
};

Login.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default Login;
