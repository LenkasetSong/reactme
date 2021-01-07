import React, { useState, useEffect, useRef } from 'react';
import { useKeyPress, useUpdateEffect } from 'ahooks';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import styles from './frequencyInput.module.less';

const FrequencyInput = (props) => {
  // 外部传值 value：值；onValueChange：输入值变更回调事件；
  // hideKeys：设置始终隐藏的按键；unavailableKeys：设置始终不可用的按键
  // decimals: 小数点位数;
  // miniValue: 最小值; maxValue: 最大值
  // unitSuffix: 单位文本
  // KeyBoardStyle: 键盘输入样式
  // antd input 输入框样式
  const {
    value,
    onValueChange,
    hideKeys,
    unavailableKeys,
    decimals,
    miniValue,
    maxValue,
    unitSuffix,
    keyBoardStyle,
    inputStyle,
  } = props;

  // 根据不同的端，设置是否只读
  const [inputReadOnly, setReadOnly] = useState(false);
  // 当read only时光标闪烁显示状态
  const [blink, setBlink] = useState(false);
  // 是否正在输入，即键盘处于展开状态
  const [inputting, setInputting] = useState(false);
  // 当前输入单位
  const [inputUnit, setInputUnit] = useState(unitSuffix);
  // 当前值
  const [currentValue, setCurrentValue] = useState(String(value));
  // 正在输入值
  const [inputtingValue, setInputtingValue] = useState(String(value));
  // 输入过程逻辑控制不可用按键
  const [disabledKeys, setDisabledKeys] = useState([]);
  const inputRef = useRef(); // 创建useRef
  const keyHandleRef = useRef();
  // 自定义键盘Key值
  const keys = [
    '+/-',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '0',
    '.',
    '←',
  ];
  // 最大输入长度
  const inputMaxLenth = 10;

  /**
   * 检查当前正在输入的值中是否已经不在被禁用的按键
   * 移除它们
   */
  const updateDisbleOnDel = (curInputting) => {
    const indx = curInputting.indexOf('.');
    const keyDisable =
      curInputting.length >= inputMaxLenth ||
      (decimals > 0 && indx > 0 && curInputting.length - indx >= decimals);

    const dsKeys = disabledKeys.filter((k) => {
      if (k === '.') {
        return curInputting.includes(k) || keyDisable;
      }
      if (k === '0-9') {
        return keyDisable;
      }
      return false;
    });
    setDisabledKeys(dsKeys);
  };

  /**
   * 校验输入是否合法
   * 小数位数 输入长度限制
   */
  const checkInputting = () => {
    const indx = inputtingValue.indexOf('.');
    let canGo = false;
    if (
      (indx < 0 || inputtingValue.length - indx <= decimals) &&
      inputtingValue.length < inputMaxLenth
    ) {
      canGo = true;
    }
    if (
      inputtingValue.length >= inputMaxLenth - 1 ||
      (decimals > 0 && indx > 0 && inputtingValue.length - indx >= decimals)
    ) {
      setDisabledKeys(['0-9', '.', ...disabledKeys]);
    }
    return canGo;
  };

  useEffect(() => {
    // 判断操作系统类型，决定input是否只读
    // warning 此处不确定这样判断是不是存在问题
    let ro = false;
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)
    ) {
      ro = true;
      setReadOnly(true);
    } else {
      setReadOnly(false);
    }

    // 只读的情况下自定义闪烁下划线
    let bl = false;
    setInterval(() => {
      if (ro) {
        setBlink(!bl);
        bl = !bl;
      }
    }, 500);
  }, []);

  /**
   * 监听键盘事件，处理esc和enter
   */
  useKeyPress(
    ['esc', 'enter'],
    (e) => {
      if (e.key === 'Escape') {
        setInputting(false);
      }
      if (e.key === 'Enter') {
        setInputting(false);
        setCurrentValue(inputtingValue);
      }
    },
    { target: keyHandleRef }
  );

  /**
   * 确定输入值通知外部
   */
  useUpdateEffect(() => {
    if (onValueChange) {
      let newVal = Number(currentValue);
      if (newVal < miniValue) {
        newVal = miniValue;
      }
      if (newVal > maxValue) {
        newVal = maxValue;
      }
      // console.log('new value', newVal);
      const newValStr = String(newVal);
      if (newValStr !== currentValue) {
        setCurrentValue(newValStr);
        // 再次检查一次
        updateDisbleOnDel(newValStr);
        return;
      }
      onValueChange(newVal);
    }
  }, [currentValue]);

  /**
   * 设置值，检查小数点按钮是否需要禁用或启用
   * 这里仅在展开面板时设置值的情况下有用，感觉没必要，暂时屏蔽
   */
  useEffect(() => {
    // console.log('value change on effect', value);
    const valString = String(value);
    if (valString.includes('.') && !disabledKeys.includes('.')) {
      setDisabledKeys(['.', ...disabledKeys]);
    }
    const dsKeys = disabledKeys.filter((k) => valString.includes(k));
    setDisabledKeys(dsKeys);
    // console.log('disabledKeys', disabledKeys);
    // if (inputting) {
    //   setInputtingValue(value);
    // } else {
    setCurrentValue(value);
    // }
  }, [value]);

  /**
   * 检查当前正在输入的值中是否已经不在被禁用的按键
   * 移除它们
   */
  // const updateDisbleOnDel = (curInputting) => {
  //   const dsKeys = disabledKeys.filter((k) => curInputting.includes(k));
  //   setDisabledKeys(dsKeys);
  // };

  /**
   * 校验输入是否合法
   * 小数位数 输入长度限制
   */
  // const checkInputting = () => {
  //   const indx = inputtingValue.indexOf('.');
  //   let canGo = false;
  //   if (
  //     (indx < 0 || inputtingValue.length - indx <= decimals) &&
  //     inputtingValue.length < inputMaxLenth
  //   ) {
  //     canGo = true;
  //   }

  //   if (decimals > 0 && indx > 0 && inputtingValue.length - indx >= decimals) {
  //     setDisabledKeys(['0-9', ...disabledKeys]);
  //   }
  //   if (inputtingValue.length >= inputMaxLenth - 1) {
  //     setDisabledKeys(['0-9', '.', ...disabledKeys]);
  //   }
  //   return canGo;
  // };

  /**
   * 按键点击输入事件
   * @param {*} key
   */
  const keysInput = (key) => {
    const preValue = inputtingValue;
    switch (key) {
      case '+/-':
        if (preValue.startsWith('-')) {
          setInputtingValue(preValue.slice(1, preValue.length));
        } else {
          setInputtingValue(`-${preValue}`);
        }
        break;
      case '←':
        // eslint-disable-next-line no-case-declarations
        const newInputting = preValue.slice(0, preValue.length - 1);
        setInputtingValue(newInputting);
        updateDisbleOnDel(newInputting);
        break;
      case '.':
        setInputtingValue(`${preValue}${key}`);
        setDisabledKeys(['.', ...disabledKeys]);
        break;
      case 'esc':
        setInputting(false);
        break;
      case 'enter':
        setInputting(false);
        setCurrentValue(inputtingValue);
        break;
      default:
        if (checkInputting()) {
          setInputtingValue(`${preValue}${key}`);
        }
        break;
    }
    if (key !== 'enter' && key !== 'esc') {
      // 重新设置焦点
      inputRef.current.focus();
    }
  };

  /**
   * 系统键盘输入事件
   * @param {*} e
   */
  const inputChange = (e) => {
    e.persist();
    const newVal = e.target.value;
    const addChar = newVal.length > inputtingValue.length;
    const lastKey = String(newVal).slice(newVal.length - 1, newVal.length);
    if (addChar) {
      if (
        !keys.includes(lastKey) ||
        !checkInputting() ||
        (lastKey === '.' && String(inputtingValue).includes('.'))
      ) {
        return;
      }
      if (String(newVal).endsWith('.')) {
        // TODO 设置 . 按钮不可用
        setDisabledKeys(['.', ...disabledKeys]);
      }
    } else {
      updateDisbleOnDel(newVal);
    }
    setInputtingValue(newVal);
  };

  /**
   * 按键 函数组件
   * @param {*} bind 传入按键值和显示文本
   */
  const Keys = (bind) => {
    const { keyValue, keyCaption } = bind;
    // 鼠标是否在按键内
    const [hoverKey, setHoverKey] = useState(false);
    // 鼠标是否按下按键
    const [mouseDown, setMouseDown] = useState(false);

    /**
     * 获取不同状态下classname
     */
    const getClassName = () => {
      const numKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
      // console.log(disabledKeys);
      if (
        disabledKeys.includes(keyValue) ||
        (disabledKeys.includes('0-9') && numKeys.includes(keyValue))
      ) {
        return styles.keysDisabled;
      }
      if (mouseDown) {
        return styles.keysDown;
      }
      if (hoverKey) {
        return styles.keysHover;
      }
      return styles.keysNormal;
    };
    // 1 判断是否需要隐藏
    if (hideKeys && hideKeys.includes(keyValue)) {
      return null;
    }
    // 2 判断是否被外部禁用或内部输入逻辑临时禁用
    if (disabledKeys.includes(keyValue) || unavailableKeys.includes(keyValue)) {
      return (
        <div
          className={styles.keysDisabled}
          style={{ flex: 1, overflow: 'hidden', marginLeft: '2px' }}
        >
          {keyCaption}
        </div>
      );
    }
    return (
      <div
        className={getClassName()}
        style={{ flex: 1, overflow: 'hidden', marginLeft: '2px' }}
        onClick={() => keysInput(keyValue)}
        onMouseEnter={() => setHoverKey(true)}
        onMouseLeave={() => setHoverKey(false)}
        onMouseDown={() => setMouseDown(true)}
        onMouseUp={() => setMouseDown(false)}
        onTouchStart={() => setMouseDown(true)}
        onTouchEnd={() => setMouseDown(false)}
        // onPaste={(e) => e.preventDefault()}
        // onPasteCapture={(e) => e.preventDefault()}
      >
        {keyCaption}
      </div>
    );
  };

  /**
   * 自定义输入键盘 组件
   */
  const KeyBoard = () => {
    if (inputting) {
      return (
        <div className={keyBoardStyle || styles.KeyBoard}>
          <div className={styles.leftKeys}>
            {keys.map((k) => {
              return <Keys key={k} keyValue={k} keyCaption={k} />;
            })}
          </div>
          <div className={styles.rightKeys}>
            <Keys keyValue="esc" keyCaption="取消" />
            <Keys keyValue="enter" keyCaption="确认" />
          </div>
        </div>
      );
    }
    return null;
  };

  /**
   * 输入框获取到焦点事件处理
   * 展开输入键盘
   */
  const inputFocus = () => {
    if (!inputting) {
      setInputtingValue(currentValue);
      // const valString = String(currentValue);
      if (currentValue.includes('.') && !disabledKeys.includes('.')) {
        setDisabledKeys(['.', ...disabledKeys]);
      }
      setInputting(true);
    }
    // 重新设置焦点
    // inputRef.current.focus();
  };

  /**
   * 获取输入框显示值
   */
  const inputDisplay = () => {
    const val = inputting ? inputtingValue : currentValue;
    if (inputReadOnly && inputting && blink) {
      return `${val}_`;
    }
    return val;
  };

  return (
    <div ref={keyHandleRef}>
      <Input
        ref={inputRef}
        className={inputStyle || styles.inputer}
        allowClear={inputting}
        value={inputDisplay()}
        maxLength={inputMaxLenth}
        suffix={inputUnit}
        onClick={() => inputFocus()}
        onChange={(e) => inputChange(e)}
        readOnly={inputReadOnly}
      />
      <KeyBoard />
      {/* <div className={styles.inputerfocus}>test dd</div> */}
    </div>
  );
};

FrequencyInput.defaultProps = {
  value: 98,
  onValueChange: () => {},
  hideKeys: [],
  unavailableKeys: [],
  decimals: 3,
  miniValue: 20,
  maxValue: 8000,
  unitSuffix: 'MHz',
  keyBoardStyle: '',
  inputStyle: '',
};

FrequencyInput.propTypes = {
  value: PropTypes.number,
  onValueChange: PropTypes.func,
  hideKeys: PropTypes.array,
  unavailableKeys: PropTypes.array,
  decimals: PropTypes.number,
  miniValue: PropTypes.number,
  maxValue: PropTypes.number,
  unitSuffix: PropTypes.string,
  keyBoardStyle: PropTypes.string,
  inputStyle: PropTypes.string,
};

export default FrequencyInput;
