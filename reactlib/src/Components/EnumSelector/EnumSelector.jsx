import React, { useState, useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useUpdateEffect } from 'ahooks';
import Icon, {
  LeftSquareOutlined,
  RightSquareOutlined,
} from '@ant-design/icons';
import { List, Radio, Popover, Drawer, Image } from 'antd';
import styles from './enumSelector.module.less';

/**
 *
 * @param {*} props
 */
const EnumSelector = (props) => {
  // caption 标签文本信息，如设置channelItems则设置此属性无效
  // value 默认选中的带宽值  如：150
  // levelValue 默认选中的 二级值 如：['广播电视', 95.5]
  // items  带宽选择：[{value,display}]
  // levelItems 二级选择 [{caption, items:[{value,display}]}]
  // onValueChanged 值变更事件
  const {
    caption,
    value,
    items,
    levelValue,
    levelItems,
    onValueChanged,
    options,
  } = props;

  // 一级选项
  const [captions, setCaptions] = useState([]);
  // 当前选中的一级选项
  const [captionSelIndx, setCaptionSelIndx] = useState(0);

  // 二级选项, 默认加载 外部传入的items，如传入levelItems则动态加载
  const [secondLevel, setSecondLevels] = useState(items || []);
  // 当前选中的二级选项
  const [levelSelIndx, setLevelSelIndx] = useState(0);
  // 当前是否为二级选择
  const [subLevel, setSubLevel] = useState(levelItems.length > 0);
  const [itemsvisible, setItemsVisible] = useState(false);
  // const [subLevelPage, setSubLevelPage] = useState(1);

  useEffect(() => {
    if (items) {
      items.sort((a, b) => {
        return a.value - b.value;
      });
      setSecondLevels(items);
    }
  }, [items]);

  /**
   * 监听外部传入的二级菜单选项
   * 更新可用标题列表
   * 更新当前二级菜单列表
   */
  useEffect(() => {
    if (levelItems && levelItems.length > 0) {
      const cps = levelItems.map((l) => {
        return l.caption;
      });

      setCaptions(cps);
      let subLevels = levelItems[captionSelIndx]?.items;
      if (!subLevels || subLevels !== null) {
        subLevels = [];
      }
      const dd = [{ value: 0, display: '未匹配' }, ...subLevels];
      setSecondLevels(dd);
      setSubLevel(levelItems.length > 0);
    }
  }, [levelItems]);

  /**
   * 监听外部传入的二级菜单选择值
   * 更新当前选择
   */
  useEffect(() => {
    if (levelValue && levelValue.length > 0) {
      if (levelItems && levelItems.length > 0) {
        const cps = levelItems.map((l) => {
          return l.caption;
        });
        const index = cps.indexOf(levelValue[0]);
        if (index > -1) {
          setCaptionSelIndx(index);
          const subLevels = levelItems[index].items;
          // subLevels.sort(function (a, b) {
          //   return a.value - b.value;
          // });
          const dd = [{ value: 0, display: '未匹配' }, ...subLevels];
          setSecondLevels(dd);
          // 匹配索引
          let secSel = dd.findIndex((sub, i) => sub.value === levelValue[1]);
          secSel = secSel < 0 ? 0 : secSel;
          // console.log(dd, secSel);
          setLevelSelIndx(secSel);
        }
      }
    } else if (levelItems && levelItems.length > 0) {
      setLevelSelIndx(0);
    }
    // console.log(levelValue, levelItems);
  }, [levelValue]);

  /**
   * 监听外部传入的一级值
   * 更新当前选中的值
   */
  useEffect(() => {
    // console.log('value', value);
    if (!subLevel) {
      const indx = items.findIndex((v) => {
        return v.value === value;
      });
      if (indx > -1) {
        setLevelSelIndx(indx);
      }
    }
  }, [value]);

  /**
   * 监听内部二级菜单选择索引
   * 出发事件，通知选择变更
   */
  useUpdateEffect(() => {
    // console.log('value select chagned', levelSelIndx);
    if (onValueChanged && levelSelIndx > -1) {
      const val = secondLevel[levelSelIndx].value;
      if (val > 0) {
        onValueChanged(levelSelIndx, val);
      }
    }
  }, [levelSelIndx]);

  /**
   * 生成四位随机数
   * @returns {string}
   */
  const createFour = () =>
    // eslint-disable-next-line no-bitwise
    (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);

  const backStep = () => {
    if (subLevel) {
      if (captionSelIndx >= 0 && levelSelIndx > 0) {
        const newVal = levelSelIndx - 1;
        setLevelSelIndx(newVal);
      }
    } else if (levelSelIndx > 0) {
      const newVal = levelSelIndx - 1;
      setLevelSelIndx(newVal);
    }
  };

  const nextStep = () => {
    // if (subLevel) {
    //   if (
    //     captionSelIndx < captions.length ||
    //     levelSelIndx < secondLevel.length - 2
    //   ) {
    //     console.log(levelSelIndx, secondLevel);
    //     const newVal = levelSelIndx + 1;
    //     setLevelSelIndx(newVal);
    //   }
    // } else
    if (levelSelIndx < secondLevel.length - 1) {
      const newVal = levelSelIndx + 1;
      // console.log(newVal, secondLevel);
      setLevelSelIndx(newVal);
    }
  };

  /**
   * 函数组件
   * 下拉选择面板
   */
  const DropdownItems = () => {
    return (
      <div
        style={{
          height: '249px',
          width: '980px',
          overflowY: 'scroll',
          overflowX: 'hidden',
        }}
      >
        <Radio.Group
          size="large"
          defaultValue={0}
          value={levelSelIndx}
          buttonStyle="solid"
          onChange={(e) => {
            // console.log(e, subLevelPage);
            const indx = e.target.value;
            setLevelSelIndx(indx);
            setItemsVisible(false);
          }}
        >
          <List
            style={{ height: '100%' }}
            grid={{ gutter: 16, column: 4 }}
            dataSource={secondLevel}
            size="large"
            renderItem={(item, index) => (
              <List.Item>
                <Radio.Button
                  value={index}
                  style={{ width: '100%', textAlign: 'center' }}
                >
                  {item.display}
                </Radio.Button>
              </List.Item>
            )}
          />
        </Radio.Group>
      </div>
    );
  };

  /**
   * 函数组件
   * 标题信息 / 业务信息
   */
  const CaptionLabel = () => {
    const [capSelVisible, setCapSelVisible] = useState(false);
    return (
      <div className={subLevel ? styles.caption : ''}>
        <span
          onClick={() => {
            setCapSelVisible(subLevel);
          }}
        >
          {subLevel ? captions[captionSelIndx] : caption}
        </span>
        <Drawer
          visible={capSelVisible}
          placement="right"
          onClose={() => setCapSelVisible(false)}
        >
          <Radio.Group
            defaultValue={0}
            value={captionSelIndx}
            buttonStyle="solid"
            onChange={(e) => {
              const targetIndx = e.target.value;
              // 自动匹配
              const realVal = secondLevel[levelSelIndx].value;
              const tgItems = levelItems[targetIndx].items;
              const newItems = [{ value: 0, display: '未匹配' }, ...tgItems];
              // 查找值相同的索引
              let sameValIndx = newItems.findIndex((l) => l.value === realVal);
              if (sameValIndx < 0) {
                sameValIndx = 0;
              }

              // md, 还要保证值不能变
              setCaptionSelIndx(targetIndx);
              setSecondLevels(newItems);
              setLevelSelIndx(sameValIndx);
            }}
          >
            {captions.map((item, index) => {
              return (
                <Radio.Button
                  value={index}
                  style={{
                    width: '100%',
                    textAlign: 'center',
                    marginTop: '10px',
                  }}
                  key={createFour()}
                >
                  {item}
                </Radio.Button>
              );
            })}
          </Radio.Group>
        </Drawer>
      </div>
    );
  };

  return (
    <div className={styles.root}>
      <div style={{ display: 'flex' }} onClick={() => backStep()}>
        {options.leftIcon ? (
          // <Icon component={options.leftIcon} />
          <Image
            className={styles.pager}
            src={options.leftIcon}
            preview={false}
          />
        ) : (
          <LeftSquareOutlined className={styles.pager} />
        )}
      </div>
      <div className={styles.content}>
        <CaptionLabel />
        <Popover
          placement="bottomLeft"
          content={DropdownItems}
          trigger="click"
          visible={itemsvisible}
          onVisibleChange={(e) => {
            if (subLevel && secondLevel.length < 2) {
              return;
            }
            setItemsVisible(e);
          }}
          style={{ width: '60%' }}
        >
          <span style={{ marginLeft: '12px', textAlign: 'left', width: '50%' }}>
            {secondLevel.length > 0 ? secondLevel[levelSelIndx].display : ''}
          </span>
        </Popover>
      </div>
      <div onClick={() => nextStep()}>
        {options.rightIcon ? (
          // <Icon component={options.rightIcon} />
          <Image
            className={styles.pager}
            src={options.rightIcon}
            preview={false}
          />
        ) : (
          <RightSquareOutlined className={styles.pager} />
        )}
      </div>
    </div>
  );
};

EnumSelector.defaultProps = {
  caption: '',
  value: 0,
  items: [],
  levelValue: [],
  levelItems: [],
  onValueChanged: () => {},
  options: {},
};

EnumSelector.propTypes = {
  caption: PropTypes.string,
  value: PropTypes.any,
  items: PropTypes.array,
  levelValue: PropTypes.any,
  levelItems: PropTypes.array,
  onValueChanged: PropTypes.func,
  options: PropTypes.object,
};

export default EnumSelector;
