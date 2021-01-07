/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Button, Input } from 'antd';
import SaveTemplate from '@/Components/SpectrumTemplate/saveTemplate';
import SelectTemplate from '@/Components/SpectrumTemplate/selectTemplate';

const UnitCovnert = () => {
  const [datas, setDatas] = useState({});
  const spesData = {};
  useEffect(() => {
    const pointCount = 1601;
    const realData = [];
    const rainDataMax = [];
    const rainDataAvg = [];
    for (let i = 0; i < pointCount; i += 1) {
      rainDataMax[i] = Math.round(Math.random() * 10 + 55);
      rainDataAvg[i] = 45 + Math.round(Math.random() * 10);
      const rad = (i % 360) * (Math.PI / 180);
      realData[i] = Math.round(Math.random() * 30) + Math.sin(rad) * 25;
      if (i % 200 === 33) {
        realData[i] = 75;
      }
    }
    setDatas({
      data: realData,
      maximum: rainDataMax,
      mean: rainDataAvg,
    });
  }, []);

  const templates = [
    {
      name: 'test1',
      creator: 'admin',
      cratetime: '2020-12-21 17:13:13',
      bandwidth: 200,
    },
    {
      name: 'test2',
      creator: 'admin',
      cratetime: '2020-12-21 17:13:13',
      bandwidth: 200,
    },
  ];

  return (
    <div>
      <SaveTemplate
        spectrumData={datas}
        onSave={(e) => console.log('save template', e)}
        onCancel={() => console.log('canel save template')}
      />
      <br />
      <SelectTemplate
        templates={templates}
        onCancel={() => console.log('canel select template')}
        onConfirm={(e) => console.log('template selected', e)}
        onSelectChange={(e) => {
          console.log(e.template);
          setTimeout(() => {
            e.callback({
              sourceData: [
                0,
                0,
                0,
                1,
                1,
                1,
                5,
                5,
                5,
                5,
                2,
                2,
                3,
                3,
                10,
                10,
                5,
                5,
                5,
                2,
                2,
                3,
                3,
                10,
                10,
              ],
              solidData: [
                0,
                0,
                0,
                1,
                1,
                1,
                5,
                5,
                5,
                5,
                2,
                2,
                3,
                3,
                10,
                10,
                5,
                5,
                5,
                2,
                2,
                5,
                5,
                5,
                5,
              ],
            });
          }, 2000);
        }}
      />
    </div>
  );
};

export default UnitCovnert;
