import React, { useState, useEffect, useRef } from 'react';
import { useKeyPress, useUpdateEffect } from 'ahooks';
import PropTypes from 'prop-types';
import { Form, Input, Checkbox, Button, Spin } from 'antd';
import { SingleSpectrum } from 'dclc';
import styles from './spectrumTemplate.module.less';

const SelectTemplate = (props) => {
  // templates 模板列表
  // onSelectChange 选择变更事件通知外部
  // onCancel 隐藏此面板事件，通知外部
  // onConfirm 选择确认事件，通知外部
  // thresolds 门限 [上门限, 下门限]
  // limitMode 门限模式
  const { templates, onSelectChange, onCancel, onConfirm, limitMode } = props; // specMax, specReal, speacAvg

  // useEffect(() => {
  //   console.log(setTempData);
  // }, [setTempData]);

  const [selectTemp, setSelectTemp] = useState('');
  const [useSolid, setUseSolid] = useState(false);
  const [chartData, setChartData] = useState({});
  const [spin, setSpin] = useState(false);

  const limitModeSelHanle = (t) => {
    if (limitMode && !t.topLimit) {
      // 门限选择模式
      setSpin(true);
      onSelectChange({
        template: t,
        callback: (data) => {
          const { topLimit, bottomLimit } = data;
          t.topLimit = topLimit;
          t.bottomLimit = bottomLimit;
          // 设置给chart
          // setThresholdData({
          //   thresholdTop: topLimit,
          //   thresholdBottom: bottomLimit,
          // });
          setSpin(false);
        },
      });
    } else {
      const { topLimit, bottomLimit } = t;
      // 设置给chart
      // setThresholdData({
      //   thresholdTop: topLimit,
      //   thresholdBottom: bottomLimit,
      // });
    }
  };

  const templateSelHandle = (t) => {
    if (onSelectChange && !t.sourceData) {
      setSpin(true);
      onSelectChange({
        template: t,
        callback: (data) => {
          const { sourceData, solidData } = data;
          t.sourceData = sourceData;
          t.solidData = solidData;
          // 设置给chart
          // setTemplateData({
          //   data: sourceData,
          //   bandwith: t.bandwidth,
          // });
          setSpin(false);
        },
      });
    } else {
      const { sourceData, bandwidth } = t;
      // 设置给chart
      // setTemplateData({
      //   data: sourceData,
      //   bandwith: t.bandwidth,
      // });
    }
  };

  return (
    <div>
      <Spin tip="加载中..." spinning={spin}>
        <div className={styles.items}>
          {templates.length <= 0 ? (
            <span>当前还没有可用模板</span>
          ) : (
            templates.map((t) => (
              <div
                className={
                  selectTemp.name === t.name ? styles.itemSelected : styles.item
                }
                key={String(Math.random())}
                onClick={() => {
                  setUseSolid(false);
                  setSelectTemp(t);
                  // 门限选择模式
                  limitModeSelHanle(t);
                  templateSelHandle(t);
                }}
              >
                <div className={styles.itemName}>{t.name}</div>
                <div className={styles.itemDes}>
                  {t.creator && t.creator !== null ? (
                    <span>
                      创建者：
                      {t.creator}
                    </span>
                  ) : null}
                  {t.cratetime && t.cratetime !== null ? (
                    <span className={styles.desitem}>
                      创建时间：
                      {t.cratetime}
                    </span>
                  ) : null}

                  {t.bandwidth && t.bandwidth !== null ? (
                    <span className={styles.desitem}>
                      带宽(kHz)：
                      {t.bandwidth}
                    </span>
                  ) : null}
                </div>
              </div>
            ))
          )}
        </div>
        <div>
          <SingleSpectrum
            visibleCharts={['specChart']}
            visibleAxisY={false}
            data={chartData}
            audiowidth={0}
          />
        </div>
        <div className={styles.opbuttons}>
          {selectTemp.sourceData && selectTemp.solidData ? (
            <Checkbox
              style={{ fontSize: 'large', padding: '15px' }}
              checked={useSolid}
              onChange={(e) => {
                setUseSolid(e.target.checked);
                setChartData({
                  data: e.target.checked
                    ? selectTemp.solidData
                    : selectTemp.sourceData,
                });
              }}
            >
              使用包络线
            </Checkbox>
          ) : null}
          <div>
            <Button
              size="large"
              style={{ padding: '0 18px 0 18px' }}
              onClick={() => {
                if (onCancel) {
                  onCancel();
                }
              }}
            >
              取消
            </Button>
            <Button
              size="large"
              type="primary"
              style={{ padding: '0 18px 0 18px', marginLeft: '18px' }}
              onClick={() => {
                if (onConfirm) {
                  onConfirm({ template: selectTemp, useSolidData: useSolid });
                }
              }}
            >
              确定
            </Button>
          </div>
        </div>
      </Spin>
    </div>
  );
};

SelectTemplate.defaultProps = {
  templates: [],
  // setTempData: {},
  onSelectChange: () => {},
  onCancel: () => {},
  onConfirm: () => {},
  limitMode: false,
};

SelectTemplate.propTypes = {
  templates: PropTypes.array,
  // setTempData: PropTypes.object,
  onSelectChange: PropTypes.func,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  limitMode: PropTypes.bool,
};

export default SelectTemplate;
