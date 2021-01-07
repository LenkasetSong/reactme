/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Button, Input } from 'antd';
import EnumSelector from '../../../Components/EnumSelector/EnumSelector';
import leftArrow from '@/assets/images/arrow-left.png';
import rightArrow from '@/assets/images/arrow-right.png';

const EnumSelectorDemo = () => {
  const [testTip, setTestTip] = useState('');
  const [levelSel, setLevelSel] = useState(['广播', 50]);
  const data1 = [
    { value: 50, display: '50 kHz' },
    { value: 100, display: '100 kHz' },
    { value: 150, display: '150 kHz' },
    { value: 500, display: '500 kHz' },
    { value: 200, display: '200 kHz' },
  ];
  const data2 = [
    {
      caption: '广播',
      items: [
        { value: 50, display: 'ch1|50 kHz' },
        { value: 100, display: 'ch2|100 kHz' },
        { value: 150, display: 'ch3|150 kHz' },
        { value: 200, display: 'ch4|200 kHz' },
        { value: 500, display: 'ch5|500 kHz' },
        { value: 51, display: 'ch1|51 kHz' },
        { value: 100, display: 'ch2|101 kHz' },
        { value: 150, display: 'ch3|151 kHz' },
        { value: 200, display: 'ch4|201 kHz' },
        { value: 500, display: 'ch5|501 kHz' },
        { value: 50, display: 'ch1|52 kHz' },
        { value: 100, display: 'ch2|102 kHz' },
        { value: 150, display: 'ch3|152 kHz' },
        { value: 200, display: 'ch4|202 kHz' },
        { value: 500, display: 'ch5|502 kHz' },
        { value: 50, display: 'ch1|53 kHz' },
        { value: 100, display: 'ch2|103 kHz' },
        { value: 150, display: 'ch3|153 kHz' },
        { value: 200, display: 'ch4|203 kHz' },
        { value: 500, display: 'ch5|503 kHz' },
        { value: 54, display: 'ch1|54 kHz' },
        { value: 104, display: 'ch2|104 kHz' },
        { value: 154, display: 'ch3|154 kHz' },
        { value: 204, display: 'ch4|204 kHz' },
        { value: 504, display: 'ch5|504 kHz' },
        { value: 55, display: 'ch1|55 kHz' },
        { value: 105, display: 'ch2|105 kHz' },
        { value: 155, display: 'ch3|155 kHz' },
        { value: 205, display: 'ch4|205 kHz' },
        { value: 505, display: 'ch5|505 kHz' },
        { value: 56, display: 'ch1|56 kHz' },
        { value: 506, display: 'ch5|506 kHz' },
      ],
    },
    {
      caption: '电视',
      items: [
        { value: 55, display: 'ch1|50 kHz' },
        { value: 110, display: 'ch1|100 kHz' },
        { value: 150, display: 'ch1|150 kHz' },
        { value: 205, display: 'ch1|200 kHz' },
        { value: 505, display: 'ch1|500 kHz' },
      ],
    },
  ];

  const [subItems, setSubItems] = useState(data2);

  const [items, setItems] = useState(data1);

  const ops = {
    leftIcon: leftArrow,
    rightIcon: rightArrow,
  };

  useEffect(() => {
    setTimeout(() => {
      setLevelSel(['广播', 56]);
    }, 5000);
  }, []);

  return (
    <div>
      <div style={{ width: '260px' }}>
        带宽设置
        <br />
        <EnumSelector
          caption="带宽"
          items={items}
          onValueChanged={(index, value) => {
            console.log('bandwidth changed', value);
          }}
        />
        <br />
        <Button
          onClick={() => {
            // setItems([
            //   { value: 2250, display: '2250 kHz' },
            //   { value: 2100, display: '2100 kHz' },
            //   { value: 2150, display: '2150 kHz' },
            //   { value: 2500, display: '2500 kHz' },
            //   { value: 2200, display: '2200 kHz' },
            // ]);
            setItems([]);
          }}
        >
          更新值
        </Button>
      </div>
      <br />
      <div style={{ width: '320px' }}>
        业务频段和信道中心频率设置
        <br />
        <EnumSelector
          levelValue={levelSel}
          levelItems={subItems}
          onValueChanged={(index, value) => {
            console.log('frequency changed', index, value);
          }}
        />
        <br />
        <div>
          <Button
            onClick={() => {
              setSubItems([
                {
                  caption: '无数据',
                  items: [],
                },
              ]);
              setLevelSel([]);
            }}
          >
            更新值
          </Button>
        </div>
      </div>
      <br />
      <div style={{ width: '320px' }}>
        自定义图标
        <br />
        <EnumSelector
          caption="带宽"
          items={data1}
          onValueChanged={(index, value) => {
            console.log('frequency changed', value);
          }}
          options={{ leftIcon: leftArrow, rightIcon: rightArrow }}
        />
      </div>
    </div>
  );
};

export default EnumSelectorDemo;
