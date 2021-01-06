/* eslint-disable import/no-anonymous-default-export */
import React, { useEffect } from "react";
import loadable from "@loadable/component";
import NProgress from "nprogress";

const useLoadingComponent = () => {
  useEffect(() => {
    NProgress.start();
    return () => {
      NProgress.done();
    };
  }, []);
  return <div />;
};

export default (Loader, Loading = useLoadingComponent) => {
  return loadable(Loader, {
    fallback: <Loading />,
  });
};
