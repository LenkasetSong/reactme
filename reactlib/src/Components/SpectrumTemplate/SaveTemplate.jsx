import React, { useState, useEffect, useRef } from 'react';
import { useKeyPress, useUpdateEffect } from 'ahooks';
import PropTypes from 'prop-types';
import { Form, Input, Radio, Button, message } from 'antd';
import { SingleSpectrum } from 'dclc';
import styles from './spectrumTemplate.module.less';

/**
 * 数据平滑
 * @param {Array} data 待平滑数据
 * @param {boolean} needTwice 是否需要进行二次平滑
 */
export const solidData = (data, needTwice = false) => {
  // console.log(data);
  const solid = executeSolid(data);
  // 二次平滑
  if (needTwice) {
    // console.log('needTwice');
    const sedSolid = executeSolid(solid);
    return sedSolid;
  }
  return solid;
};

const executeSolid = (data) => {
  const solid = [];
  const resolution = data.length > 1170 ? Math.round(data.length / 180) : 6; // 平滑点基数，左右?个
  for (let i = 0; i < data.length; i += 1) {
    let sum = 0;
    const start = i - resolution;
    const end = i + resolution;
    for (let m = start; m < end; m += 1) {
      if (m > -1 && data.length) {
        sum += data[m];
      }
    }
    const avg = sum / (resolution * 2);
    solid[i] = avg;
  }

  return solid;
};

const SaveTemplate = (props) => {
  const { spectrumData, onSave, onCancel } = props;
  const [lineType, setLineType] = useState('real');
  const [saveType, setSaveType] = useState('all');
  const [name, setName] = useState('');
  const [tempData, setTempData] = useState({});
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };
  const tailLayout = {
    wrapperCol: { offset: 16, span: 4 },
  };

  const updateTempData = (lt, st) => {
    // console.log(lt, st);
    let tmpData = spectrumData.data;
    if (lt === 'max') {
      tmpData = spectrumData.maximum;
    }
    if (lt === 'avg') {
      tmpData = spectrumData.mean;
    }
    if (st === 'onlySource') {
      setTempData({
        data: lt === 'real' ? tmpData : undefined,
        maximum: lt === 'max' ? tmpData : undefined,
        minimum: undefined,
        mean: lt === 'avg' ? tmpData : undefined,
      });
      return;
    }
    if (st === 'all') {
      setTempData({
        data: lt === 'real' ? tmpData : undefined,
        maximum: lt === 'max' ? tmpData : undefined,
        minimum: solidData(tmpData),
        mean: lt === 'avg' ? tmpData : undefined,
      });
      return;
    }
    if (st === 'onlySmooth') {
      setTempData({
        data: undefined,
        maximum: undefined,
        minimum: solidData(tmpData),
        mean: undefined,
      });
    }
  };

  const onLineTypeChange = (e) => {
    const newValue = e.target.value;
    updateTempData(newValue, saveType);
    setLineType(newValue);
  };

  const onSaveTypeChange = (e) => {
    // console.log('onSaveTypeChange', e);
    const newValue = e.target.value;
    // let tmpData = spectrumData.data;
    // if (lineType === 'max') {
    //   tmpData = spectrumData.maximum;
    // }
    // if (lineType === 'avg') {
    //   tmpData = spectrumData.mean;
    // }
    // if (newValue === 'onlySource') {
    //   setTempData({
    //     data: lineType === 'real' ? tmpData : undefined,
    //     maximum: lineType === 'max' ? tmpData : undefined,
    //     minimum: undefined,
    //     mean: lineType === 'avg' ? tmpData : undefined,
    //   });
    //   return;
    // }
    // if (newValue === 'all') {
    //   setTempData({
    //     data: lineType === 'real' ? tmpData : undefined,
    //     maximum: lineType === 'max' ? tmpData : undefined,
    //     minimum: solidData(tmpData),
    //     mean: lineType === 'avg' ? tmpData : undefined,
    //   });
    //   return;
    // }
    // if (newValue === 'onlySmooth') {
    //   setTempData({
    //     data: undefined,
    //     maximum: undefined,
    //     minimum: solidData(tmpData),
    //     mean: undefined,
    //   });
    // }
    updateTempData(lineType, newValue);
    setSaveType(newValue);
  };

  const onConfirmEvent = () => {
    if (name.length === 0) {
      message.info('请输入模板名称');
      return;
    }
    if (onSave) {
      // 传参
      let tmpData = tempData.data;
      if (lineType === 'max') {
        tmpData = tempData.maximum;
      }
      if (lineType === 'avg') {
        tmpData = tempData.mean;
      }
      onSave({
        name,
        line: lineType,
        sourceData: tmpData,
        solidData: tempData.minimum,
      });
    }
  };

  useEffect(() => {
    // console.log(spectrumData);
    if (spectrumData && spectrumData.data) {
      setTempData({
        data: spectrumData.data,
        maximum: undefined,
        minimum: solidData(spectrumData.data),
        mean: undefined,
      });
    }
  }, [spectrumData]);

  return (
    <div>
      <div>
        <SingleSpectrum
          visibleCharts={['specChart']}
          visibleAxisY={false}
          audiowidth={0}
          data={tempData}
        />
      </div>
      <div className={styles.inputs}>
        <Form
          {...layout}
          size="large"
          initialValues={{
            linetype: 'real',
            savetype: 'all',
            templatename: '',
          }}
        >
          <Form.Item label="选择数据" name="linetype">
            <Radio.Group value={lineType} onChange={(e) => onLineTypeChange(e)}>
              <Radio.Button value="real">实时值</Radio.Button>
              {spectrumData.maximum ? (
                <Radio.Button value="max">最大值</Radio.Button>
              ) : null}
              {spectrumData.mean ? (
                <Radio.Button value="avg">平均值</Radio.Button>
              ) : null}
            </Radio.Group>
          </Form.Item>
          <Form.Item label="保存选项" name="savetype">
            <Radio.Group value={saveType} onChange={(e) => onSaveTypeChange(e)}>
              <Radio.Button value="onlySource">仅保存元数据</Radio.Button>
              <Radio.Button value="all">保存元数据和包络图</Radio.Button>
              <Radio.Button value="onlySmooth">仅保存包络图</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="模板名称" name="templatename">
            <Input
              placeholder="输入模板名称，如：FM-95.5"
              maxLength={20}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button
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
              type="primary"
              style={{ padding: '0 18px 0 18px', marginLeft: '18px' }}
              onClick={() => onConfirmEvent()}
            >
              确定
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

SaveTemplate.defaultProps = {
  spectrumData: {},
  onSave: () => {},
  onCancel: () => {},
};

SaveTemplate.propTypes = {
  spectrumData: PropTypes.object,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
};

export default SaveTemplate;
