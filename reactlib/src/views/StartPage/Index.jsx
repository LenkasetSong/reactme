import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
// import FreqInputer from 'json-rpc2/FrequencyInput';
// import { spectrum2dBm } from 'json-rpc2/SpectrumUnitConverter/SpectrumUnitConverter';
import UnitCovnert from '../Demos/SpectrumUnitConverter/unitConvert.jsx';
import AudioPlayer from '../Demos/AudioPlayer/audioPlayer.jsx';

const Test = (props) => {
  const { history } = props;

  useEffect(() => {
    // // 构造测试数据
    // const dataCount = 1000000;
    // const data = [];
    // for (let i = 0; i < dataCount; i += 1) {
    //   data[i] = Math.random() * 65;
    // }
    // const startTime = new Date().getTime();
    // const datas = spectrum2dBm(data);
    // const endTime = new Date().getTime();
    // const gap = endTime - startTime;
    // console.log(`本次测试数据量：${dataCount}，运算耗时：${gap}ms`);
  }, []);

  return (
    <div>
      <div>
        频谱单位换算Demo
        <UnitCovnert />
      </div>
      <br />
      <div>
        PCM音频流播放Demo
        <AudioPlayer />
      </div>
      <br />
      <div>
        中心频率输入组件Demo
        <br />
        <Button onClick={() => history.push('/freqInputDemo')}>
          跳转到Demo
        </Button>
      </div>
      <div>
        业务&信道选择组件Demo
        <br />
        <Button onClick={() => history.push('/enumSelectorDemo')}>
          跳转到Demo
        </Button>
      </div>
      <br />
      <div>
        频谱模板Demo
        <br />
        <Button onClick={() => history.push('/specTemplate')}>
          跳转到Demo
        </Button>
      </div>
      <br />
      <div>
        子应用标题栏Demo
        <br />
        <Button onClick={() => history.push('/appHeadBarDemo')}>
          跳转到Demo
        </Button>
      </div>
    </div>
  );
};

Test.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default Test;
