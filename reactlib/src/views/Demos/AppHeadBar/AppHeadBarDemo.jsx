/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Button, Input } from 'antd';
import AppHeadBar from '@/Components/AppHeadBar/AppHeadBar';

const AppHeadBarDemo = () => {
  return (
    <div>
      <AppHeadBar title="单频测量" taskInfo="disable" />
    </div>
  );
};

export default AppHeadBarDemo;
