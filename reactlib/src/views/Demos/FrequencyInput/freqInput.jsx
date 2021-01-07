/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import FrequencyInput from '../../../Components/FrequencyInput';
import styles from './freqInput.module.less';

const FreqInput = () => {
  const [hidePoint, setHidePoint] = useState(false);
  const [disbaleKey, setDisableKey] = useState(false);
  const [valueTest, setValueTest] = useState(95.5);
  useEffect(() => {
    setTimeout(() => {
      console.log('set value to 100.7');
      setValueTest(100.7);
    }, 6000);
  }, []);
  return (
    <div>
      <span>中心频率输入</span>
      <div>
        <FrequencyInput
          hideKeys={['+/-']}
          value={valueTest}
          onValueChange={(e) => console.log('new frequency', e)}
        />
      </div>
      <span>幅度输入</span>
      <div>
        <FrequencyInput
          value={20}
          miniValue={-20}
          maxValue={100}
          unitSuffix="dBμV"
          decimals={1}
          onValueChange={(e) => console.log('new level', e)}
        />
      </div>
      <span>整数输入</span>
      <div>
        <FrequencyInput
          value={1}
          miniValue={-1000}
          maxValue={1000}
          unitSuffix=""
          unavailableKeys={['.']}
          onValueChange={(e) => console.log('new number', e)}
        />
      </div>
      <span>自定义键盘样式</span>
      <div>
        <FrequencyInput
          value={1}
          miniValue={-1000}
          maxValue={1000}
          keyBoardStyle={styles.kbStyle}
          unitSuffix=""
          unavailableKeys={['.']}
          onValueChange={(e) => console.log('new number', e)}
        />
      </div>
      <span>自定义输入框样式</span>
      <div>
        <FrequencyInput
          value={1}
          miniValue={-1000}
          maxValue={1000}
          unitSuffix="MHz"
          inputStyle={styles.inputStyle}
          unavailableKeys={['.']}
          onValueChange={(e) => console.log('new number', e)}
        />
      </div>
    </div>
  );
};

export default FreqInput;
