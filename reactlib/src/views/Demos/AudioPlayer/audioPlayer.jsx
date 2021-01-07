import React, { useEffect, useState } from 'react';
import { Button, Input } from 'antd';
import config from '../../../../package.json';
import PCMPlayer from '../../../Components/AudioPlayer/pcmPlayer';

// import aduioFile from '../../assets/files/audioTest.dat';
const AudioPlayer = () => {
  // 播放器实例
  const [player, setPlayer] = useState(undefined);
  // 是否正在播放着
  const [playing, setPlaying] = useState(false);
  // 是否已暂停
  const [suspend, setSuspend] = useState(false);
  // 音频数据设置计数器
  const [timer, setTimer] = useState(undefined);

  useEffect(() => {
    console.log('useEffect', playing);
    if (playing) {
      playAudio();
    }
    if (!playing && player) {
      clearInterval(timer);
      // ########################################
      // ########    4.eg:销毁实例    ###########
      // ########################################
      player.destroy();
      setPlayer(undefined);
    }
  }, [playing]);

  const playAudio = () => {
    console.log('playAudio');
    const { homepage } = config;
    const url =
      process.env.NODE_ENV === 'production'
        ? './audioTest.dat'
        : `.${homepage}/audioTest.dat`;
    console.log(homepage, url);
    fetch(url, {
      method: 'get',
      responseType: 'arraybuffer', // 'blob',
    })
      .then((res) => {
        return res.arrayBuffer();
      })
      .then((buffer) => {
        const u8Buffer = new Uint8Array(buffer);
        // 起始时间
        const startTime = new Date().getTime();
        let count = 0;
        const tmr = setInterval(() => {
          if (player && playing && !suspend) {
            // 误差调整
            if (count > 0 && count % 20 === 0) {
              const curTime = new Date().getTime();
              const gap = curTime - startTime;
              if (count * 1000 - gap >= 1000) {
                return;
              }
            }
            // 音频采样率为22050 ， 故每次给入1s 2s ?数据
            const start = count * 44100;
            let len = 44100;
            if (start + len > u8Buffer.length) {
              len = u8Buffer.length - start;
              count = -1;
            }
            const once = u8Buffer.slice(start, start + len);
            // ########################################
            // #######    2.eg:传入播放数据    ########
            // ########################################
            player.feed(once);
            count += 1;
          }
        }, 950);
        setTimer(tmr);
      });
  };

  const initialize = () => {
    // ########################################
    // #########    1.eg:创建实例    ##########
    // ########################################
    const audioPlayer = new PCMPlayer({
      encoding: '16bitInt',
      channels: 1,
      sampleRate: 22050,
      flushingTime: 2000,
    });
    setPlayer(audioPlayer);
  };

  // 播放
  const play = () => {
    setPlaying(true);
  };

  // 暂停
  const suspendPlay = () => {
    setSuspend(true);
    player.suspend();
  };

  // 继续
  const resumePlay = () => {
    setSuspend(false);
    player.resume();
  };

  // 清理缓存
  const flush = () => {
    if (player) {
      console.log('flush');
      // ########################################
      // #######    3.eg:清理内部缓存    ########
      // ########################################
      player.flush();
    }
  };

  // 销毁播放器
  const destroy = () => {
    if (player) {
      console.log('destroy');
      setPlaying(false);
      // clearInterval(timer);
      // player.destroy();
      // setPlayer(undefined);
    }
  };

  return (
    <div>
      <Button disabled={player !== undefined} onClick={() => initialize()}>
        实例化
      </Button>
      <Button
        disabled={playing || player === undefined}
        onClick={() => play(true)}
      >
        播放
      </Button>
      {/* <Button
        disabled={!playing || player === undefined}
        onClick={() => flush()}
      >
        flush
      </Button> */}
      <Button disabled={player === undefined} onClick={() => destroy()}>
        销毁
      </Button>
      <div>
        <Button disabled={!playing || suspend} onClick={() => suspendPlay()}>
          暂停
        </Button>
        <Button disabled={!suspend} onClick={() => resumePlay()}>
          继续
        </Button>
      </div>
    </div>
  );
};

export default AudioPlayer;
