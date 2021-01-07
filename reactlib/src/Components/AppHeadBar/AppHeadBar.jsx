/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Button, Input, Image, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import {
  InfoCircleFilled,
  HomeOutlined,
  UnorderedListOutlined,
  EllipsisOutlined,
} from '@ant-design/icons';
import styles from './appHeadBar.module.less';
import dcLogo from '../../assets/images/Decentest-logo.png';
import logo from '../../assets/images/Searchlight-logo.png';

const AppHeadBar = (props) => {
  // title 标题信息 String
  // taskInfo 任务信息按钮状态 String:  normal disable hide
  // taskList 后台任务信息按钮 String: normal disable hide
  // paramsMore 更多参数按钮 String:  normal disable hide
  // home 主页按钮状态 String:  normal disable hide
  // customize 自定义按钮 Array: [{name,icon,caption},...]
  // onItemPressed 按键事件 Object: {name}
  const {
    title,
    taskInfo,
    taskList,
    paramsMore,
    home,
    customize,
    onItemPressed,
  } = props;

  const itemPressed = (name) => {
    if (onItemPressed) {
      onItemPressed({ name });
    }
  };

  return (
    <div className={styles.mainContainer}>
      <Image className={styles.logo} src={logo} />
      <div className={styles.centerContainer}>
        <div className={styles.title}>{title}</div>
        <div className={styles.items}>
          <Tooltip title="任务信息">
            <Button
              shape="circle"
              icon={<InfoCircleFilled style={{ fontSize: '25px' }} />}
              size="large"
              className={styles.itemButton}
              onClick={() => itemPressed('taskinfo')}
              disabled={taskInfo === 'disable'}
              hidden={taskInfo === 'hide'}
            />
          </Tooltip>
          <Tooltip title="系统任务列表">
            <Button
              shape="circle"
              icon={<UnorderedListOutlined style={{ fontSize: '25px' }} />}
              size="large"
              className={styles.itemButton}
              onClick={() => itemPressed('tasklist')}
              disabled={taskList === 'disable'}
              hidden={taskList === 'hide'}
            />
          </Tooltip>
          <Tooltip title="高级参数设置">
            <Button
              shape="circle"
              icon={<EllipsisOutlined style={{ fontSize: '25px' }} />}
              size="large"
              className={styles.itemButton}
              onClick={() => itemPressed('paramsmore')}
              disabled={paramsMore === 'disable'}
              hidden={paramsMore === 'hide'}
            />
          </Tooltip>
          {customize && customize.length > 0
            ? customize.map((m) => (
                <Tooltip title={m.caption}>
                  <Button
                    shape="circle"
                    icon={<Image src={m.icon} style={{ fontSize: '25px' }} />}
                    size="large"
                    className={styles.itemButton}
                    onClick={() => itemPressed(m.name)}
                  />
                </Tooltip>
              ))
            : null}
          <Tooltip title="主页">
            <Button
              shape="circle"
              icon={<HomeOutlined style={{ fontSize: '25px' }} />}
              size="large"
              className={styles.itemButton}
              onClick={() => itemPressed('homepage')}
              disabled={home === 'disable'}
              hidden={home === 'hide'}
            />
          </Tooltip>
        </div>
      </div>
      <Image className={styles.logo} src={dcLogo} />
    </div>
  );
};

AppHeadBar.defaultProps = {
  title: '',
  taskInfo: 'normal',
  taskList: 'normal',
  paramsMore: 'normal',
  home: 'normal',
  customize: [],
  onItemPressed: () => {},
};

AppHeadBar.propTypes = {
  title: PropTypes.string,
  taskInfo: PropTypes.string,
  taskList: PropTypes.string,
  paramsMore: PropTypes.string,
  home: PropTypes.string,
  customize: PropTypes.array,
  onItemPressed: PropTypes.func,
};

export default AppHeadBar;
