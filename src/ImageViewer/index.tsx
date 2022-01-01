import React, { useEffect, useState, useRef } from 'react';

import AnyTouch from 'any-touch';
import classnames from 'classnames';

import Image from './image';
import { noon } from '../utils/tools';
import { ImageViewer, MoveInfo, Info } from '../utils/types';

import './styles.less';

const prefixCls = 'eco-image-viewer';

const config = {
  x: 0,
  y: 0,
  axis: { x: 0, y: 0 },
  scale: 1,
  doubleScale: 2,
  slide: 1 / 3,
  maxScale: 4,
  minScale: 0.5,
  midScale: 0.6,
  mobileWidth: 420,
  show: { zIndex: 2000, opacity: 1 },
  hide: { zIndex: -1, opacity: 0 },
  opacity: 0.8,
  rotate: 0,
};

export default (props: ImageViewer) => {
  const refRoot = useRef<any>();
  const refStart = useRef<MoveInfo>(config.axis);
  const refTimer = useRef<any>();

  const { visible = false, onClose = noon, index = 0, urls = [], onIndexChange = noon } = props;
  const refUrlsLen = useRef<number>(urls.length);

  const [transInfo, setTransInfo] = useState<MoveInfo>(config.axis);
  const [scaleRate, setScaleRate] = useState<number>(config.scale);
  const [rotateVal, setRotateVal] = useState<number>(config.rotate);
  const [opacity, setOpacity] = useState<number>(config.opacity);
  const [isPc, setIsPc] = useState<boolean>(false);
  const [isTrans, setIsTrans] = useState<boolean>(false);
  const [innerInfo, setInnerInfo] = useState<Info>({
    width: 1,
    height: 1,
  });

  const refTrans = useRef<any>(transInfo);
  refTrans.current = transInfo;
  const refScale = useRef<any>(scaleRate);
  refScale.current = scaleRate;
  const refRotate = useRef<number>(rotateVal);
  refRotate.current = rotateVal;

  const ablePrev = index > 0;
  const ableNext = index < urls.length - 1;

  useEffect(() => {
    refUrlsLen.current = urls.length;
  }, [urls.length]);

  // 防止触摸穿透
  useEffect(() => {
    if (visible) {
      document.body.classList.add(`${prefixCls}-fixed-body`);
    }
    return () => {
      document.body.classList.remove(`${prefixCls}-fixed-body`);
    };
  }, [visible]);

  // 图片过度效果
  const onTrans = () => {
    setIsTrans(true);
    setTimeout(() => {
      setIsTrans(false);
    }, 200);
  };

  // 恢复初始状态
  const onReset = () => {
    refStart.current = config.axis;
    setTransInfo(config.axis);
    setScaleRate(config.scale);
    onTrans();
    setRotateVal(config.rotate);
    setOpacity(config.opacity);
  };

  // 切换图片时，重置图片缩放、旋转、偏移属性
  useEffect(() => {
    onReset();
  }, [index]);

  // 监听移动事件
  useEffect(() => {
    console.log('监测到urls变化');
    const at = new AnyTouch(refRoot.current);
    // 单击事件
    at.on('tap', (e) => {
      // console.log('tap事件', e);
      const target = e.target as HTMLTextAreaElement;
      if (/point|tools/.test(target.className)) {
        return;
      }
      // 双击事件
      if (refTimer.current) {
        // console.log('双击');
        clearTimeout(refTimer.current);
        refTimer.current = null;
        if (refScale.current === config.scale) {
          refScale.current = config.doubleScale;
          onTrans();
          return setScaleRate(config.doubleScale);
        }
        return onReset();
      }
      refTimer.current = setTimeout(() => {
        onClose();
        onReset();
        refTimer.current = null;
      }, 200);
    });
    // 快速切换
    at.on('swipe', (e) => {
      console.log('swipe事件', e);
      if (e.direction === 'left') {
        onIndexChange((val) => {
          if (val < refUrlsLen.current - 1) {
            return val + 1;
          }
          return val;
        });
      }
      if (e.direction === 'right') {
        onIndexChange((val) => {
          if (val > 0) {
            return val - 1;
          }
          return val;
        });
      }
    });
    // 拖拽
    at.on('panmove', (e) => {
      console.log('pan事件', e.displacementX);
      let endX = parseInt((refStart.current.x + e.displacementX).toFixed(0)),
        endY = parseInt((refStart.current.y + e.displacementY).toFixed(0));
      const item = { x: endX, y: endY };
      // 上下拖拽，缩小、淡出
      if (e.displacementY !== 0 && refScale.current <= 1) {
        const rate = (window.innerHeight - Math.abs(e.displacementY)) / window.innerHeight;
        setScaleRate(rate);
        setOpacity(rate * Math.pow(config.opacity, 2));
      }
      setTransInfo(item);
    });
    // 拖拽结束
    at.on('panend', (e) => {
      // console.log('pan事件', e.x);
      const x = e.displacementX,
        y = e.displacementY;
      if (refScale.current !== config.scale) {
        refStart.current = {
          x: refStart.current.x + x,
          y: refStart.current.y + y,
        };
      }
      if (refScale.current < config.midScale) {
        onClose();
        onReset();
      } else if (refScale.current < 1) {
        onReset();
      }
      setTimeout(() => {
        setTransInfo({
          x: refScale.current === config.scale ? 0 : refTrans.current.x,
          y: refScale.current === config.scale ? 0 : refTrans.current.y,
        });
      }, 100);
      if (Math.abs(x) / window.innerWidth > config.slide && refScale.current === config.scale) {
        if (x <= 0) {
          onIndexChange((val: number) => {
            if (val < refUrlsLen.current - 1) {
              return val + 1;
            }
            return val;
          });
        } else if (x > 0) {
          onIndexChange((val: number) => {
            if (val > 0) {
              return val - 1;
            }
            return val;
          });
        }
      }
      if (refScale.current === config.scale) {
        onReset();
      }
    });
    // 缩放
    at.on('pinchmove', (e) => {
      console.log('pinch', e.deltaScale);
      if (e.scale > 1) {
        // 放大
        refScale.current = Math.min(
          Math.round(refScale.current * e.deltaScale * 100) / 100,
          config.maxScale,
        );
      } else {
        refScale.current = Math.max(
          Math.round(refScale.current * e.deltaScale * 100) / 100,
          config.minScale,
        );
      }
      setScaleRate(refScale.current);
    });
    // 缩放结束
    at.on('pinchend', () => {
      if (refScale.current < 1) {
        onReset();
      }
    });
    return () => {
      at.destroy();
    };
  }, []);

  // 判断屏幕尺寸
  const onChangeInner = () => {
    setInnerInfo({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  // 判断当前环境
  useEffect(() => {
    onChangeInner();
    setIsPc(window.innerWidth > config.mobileWidth);
    window.addEventListener('resize', () => {
      onChangeInner();
      setIsPc(window.innerWidth > config.mobileWidth);
    });
    return () => {
      window.removeEventListener('resize', () => {});
    };
  }, []);

  // 左旋
  const rotateL = () => {
    setRotateVal((val) => {
      const m = val - 90;
      refRotate.current = m;
      return m;
    });
  };

  // 右旋
  const rotateR = () => {
    setRotateVal((val) => {
      const m = val + 90;
      refRotate.current = m;
      return m;
    });
  };

  // 放大
  const zoomIn = () => {
    if (refScale.current < config.maxScale) {
      refScale.current = Math.min(refScale.current * 2, config.maxScale);
      setScaleRate(refScale.current);
      onTrans();
    }
  };

  // 缩小
  const zoomOut = () => {
    if (refScale.current > config.minScale) {
      refScale.current = Math.max(refScale.current * 0.8, config.minScale);
      setScaleRate(refScale.current);
      onTrans();
    }
  };

  // 还原
  const zoomReset = () => {
    if (refScale.current !== config.scale) {
      onReset();
    }
    if (rotateVal % 360 !== 0) {
      const m = Math.round(rotateVal / 360) * 360;
      refRotate.current = m;
      setRotateVal(m);
    }
  };

  // 上一张
  const onPrev = () => {
    if (ablePrev) {
      onIndexChange(index - 1);
    }
  };

  // 下一张
  const onNext = () => {
    if (ableNext) {
      onIndexChange(index + 1);
    }
  };

  return (
    <div
      ref={refRoot}
      className={`${prefixCls}-image-root`}
      style={visible ? config.show : config.hide}
    >
      <div
        className={`${prefixCls}-image-mask`}
        style={Object.assign({}, visible ? config.show : config.hide, {
          background: `rgba(0, 0, 0, ${opacity})`,
        })}
      />
      {urls.map((item, i) => {
        return (
          <Image
            visible={visible}
            key={i}
            src={item}
            index={index}
            site={i}
            transInfo={transInfo}
            scaleRate={scaleRate}
            innerInfo={innerInfo}
            isTrans={isTrans}
            rotateVal={rotateVal}
          />
        );
      })}
      {urls.length > 1 && (
        <div className={`${prefixCls}-point-box`}>
          {new Array(urls.length).fill(0).map((item, i) => {
            return (
              <div
                className={`${prefixCls}-point-item`}
                onMouseDown={() => onIndexChange(i)}
                onTouchEnd={() => onIndexChange(i)}
                key={i}
              >
                <span
                  className={classnames(`${prefixCls}-point`, {
                    [`${prefixCls}-point-on`]: index === i,
                  })}
                />
              </div>
            );
          })}
        </div>
      )}
      <div className={`${prefixCls}-image-tools`}>
        <div
          className={`${prefixCls}-tools-rotate ${prefixCls}-tools-rotate-l`}
          onMouseDown={rotateL}
          onTouchEnd={rotateL}
        />
        <div
          className={`${prefixCls}-tools-rotate ${prefixCls}-tools-rotate-r`}
          onMouseDown={rotateR}
          onTouchEnd={rotateR}
        />
        {isPc && (
          <>
            <span
              className={classnames(`${prefixCls}-tools-btn ${prefixCls}-tools-reduce`, {
                [`${prefixCls}-tools-gray`]: scaleRate === config.minScale,
              })}
              onMouseDown={zoomOut}
              onTouchEnd={zoomOut}
            />
            <span
              className={classnames(`${prefixCls}-tools-btn ${prefixCls}-tools-add`, {
                [`${prefixCls}-tools-gray`]: scaleRate === config.maxScale,
              })}
              onMouseDown={zoomIn}
              onTouchEnd={zoomIn}
            />
            <div
              className={`${prefixCls}-tools-reset`}
              onMouseDown={zoomReset}
              onTouchEnd={zoomReset}
            >
              重置
            </div>
            <span
              className={`${prefixCls}-tools-btn ${prefixCls}-tools-close`}
              onMouseDown={onClose}
              onTouchEnd={onClose}
            />
          </>
        )}
      </div>
      {isPc && (
        <>
          <div
            className={`${prefixCls}-tools-arrow-box ${prefixCls}-tools-left`}
            onMouseDown={onPrev}
            onTouchEnd={onPrev}
          >
            <div
              className={classnames(`${prefixCls}-tools-arrow`, {
                [`${prefixCls}-tools-active`]: ablePrev,
              })}
            />
          </div>
          <div
            className={`${prefixCls}-tools-arrow-box ${prefixCls}-tools-right`}
            onMouseDown={onNext}
            onTouchEnd={onNext}
          >
            <div
              className={classnames(`${prefixCls}-tools-arrow`, {
                [`${prefixCls}-tools-active`]: ableNext,
              })}
            />
          </div>
        </>
      )}
    </div>
  );
};
