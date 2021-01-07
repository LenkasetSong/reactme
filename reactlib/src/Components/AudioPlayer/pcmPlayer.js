function PCMPlayer(option) {
  this.init(option);
}

PCMPlayer.prototype.init = function initPlayer(option) {
  const defaults = {
    encoding: '16bitInt',
    channels: 1,
    sampleRate: 8000,
    flushingTime: 1000,
  };
  this.option = { ...defaults, ...option };
  this.samples = new Float32Array();
  this.flush = this.flush.bind(this);
  this.interval = setInterval(this.flush, this.option.flushingTime);
  this.maxValue = this.getMaxValue();
  this.createContext();
};

PCMPlayer.prototype.getMaxValue = function getMaxValue() {
  const encodings = {
    '8bitInt': 128,
    '16bitInt': 32768,
    '32bitInt': 2147483648,
    '32bitFloat': 1,
  };
  // window.console.log(this.option);
  return encodings[this.option.encoding]
    ? encodings[this.option.encoding]
    : encodings['16bitInt'];
};

PCMPlayer.prototype.getTypedArray = function getTypedArray(data) {
  const { encoding } = this.option;
  return new {
    '8bitInt': Int8Array,
    '16bitInt': Int16Array,
    '32bitInt': Int32Array,
    '32bitFloat': Float32Array,
  }[encoding](data);
};

PCMPlayer.prototype.createContext = function createAudioContext() {
  this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  this.gainNode = this.audioCtx.createGain();
  this.gainNode.gain.value = 1;
  this.gainNode.connect(this.audioCtx.destination);
  this.startTime = this.audioCtx.currentTime;
};

PCMPlayer.prototype.isTypedArray = function isTypedArray(data) {
  return (
    data.byteLength && data.buffer && data.buffer.constructor === ArrayBuffer
  );
};

/**
 * 播放音频流数据
 * @param {*} data
 */
PCMPlayer.prototype.feed = function playData(data) {
  if (!this.isTypedArray(data)) return;
  const d = this.getFormatedValue(data);
  const tmp = new Float32Array(this.samples.length + d.length);
  tmp.set(this.samples, 0);
  tmp.set(d, this.samples.length);
  this.samples = tmp;
};

PCMPlayer.prototype.getFormatedValue = function getFormatedValue(data) {
  console.log('test');
  const d = this.getTypedArray(data.buffer);
  const float32 = new Float32Array(d.length);

  for (let i = 0; i < d.length; i += 1) {
    float32[i] = d[i] / this.maxValue;
  }
  return float32;
};

PCMPlayer.prototype.volume = function setVolume(volume) {
  this.gainNode.gain.value = volume;
};

PCMPlayer.prototype.suspend = function suspendPlay() {
  if (this.audioCtx) {
    this.audioCtx.suspend();
  }
};

PCMPlayer.prototype.resume = function resumePlay() {
  if (this.audioCtx) {
    this.audioCtx.resume();
  }
};

PCMPlayer.prototype.destroy = function destroy() {
  if (this.interval) {
    clearInterval(this.interval);
  }
  this.samples = null;
  if (this.audioCtx) {
    this.audioCtx.close();
  }
  this.audioCtx = null;
};

// PCMPlayer.prototype.flush = function flushBuffer() {
const flush = () => {
  if (!this.samples.length) return;
  const bufferSource = this.audioCtx.createBufferSource();
  const length = this.samples.length / this.option.channels;
  const audioBuffer = this.audioCtx.createBuffer(
    this.option.channels,
    length,
    this.option.sampleRate
  );
  let audioData;
  let offset;
  let decrement;

  for (let channel = 0; channel < this.option.channels; channel += 1) {
    audioData = audioBuffer.getChannelData(channel);
    offset = channel;
    decrement = 50;
    for (let i = 0; i < length; i += 1) {
      audioData[i] = this.samples[offset];
      if (i < 50) {
        audioData[i] = (audioData[i] * i) / 50;
      }
      if (i >= length - 51) {
        audioData[i] = (audioData[i] * (decrement -= 1)) / 50;
      }
      offset += this.option.channels;
    }
  }

  if (this.startTime < this.audioCtx.currentTime) {
    this.startTime = this.audioCtx.currentTime;
  }
  // window.console.log(
  //   `start vs current ${this.startTime} vs ${this.audioCtx.currentTime} duration: ${audioBuffer.duration}`
  // );
  bufferSource.buffer = audioBuffer;
  bufferSource.connect(this.gainNode);
  bufferSource.start(this.startTime);
  this.startTime += audioBuffer.duration;
  this.samples = new Float32Array();
};

export default PCMPlayer;
