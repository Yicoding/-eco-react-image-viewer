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
  mindScale: 0.6,
  mobileWidth: 420,
};

export default (props: ImageViewer) => {
  const refRoot = useRef<any>();
  const refScale = useRef<any>(config.scale);
  const refTrans = useRef<any>(config.axis);
  const refStart = useRef<MoveInfo>(config.axis);
  const refTimer = useRef<any>();

  const { onClose = noon, index = 0, urls = [] } = props;

  const [currentIndex, setCurrentIndex] = useState<number>(index);
  const [transInfo, setTransInfo] = useState<MoveInfo>(config.axis);
  const [scaleRate, setScaleRate] = useState<number>(config.scale);
  const [isPc, setIsPc] = useState<boolean>(false);
  const [isTrans, setIsTrans] = useState<boolean>(false);
  const [innerInfo, setInnerInfo] = useState<Info>({
    width: 1,
    height: 1,
  });

  const ablePrev = currentIndex > 0;
  const ableNext = currentIndex < urls.length - 1;

  // 防止触摸穿透
  useEffect(() => {
    document.body.classList.add(`${prefixCls}-fixed-body`);
    return () => {
      document.body.classList.remove(`${prefixCls}-fixed-body`);
    };
  }, []);

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
    refTrans.current = config.axis;
    setScaleRate(config.scale);
    refScale.current = config.scale;
    onTrans();
  };

  // 监听移动事件
  useEffect(() => {
    onReset();
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
        clearTimeout(refTimer.current);
        refTimer.current = null;
        if (refScale.current === config.scale) {
          refScale.current = config.doubleScale;
          return setScaleRate(config.doubleScale);
        }
        return onReset();
      }
      refTimer.current = setTimeout(() => {
        onClose();
      }, 200);
    });
    at.on('swipe', (e) => {
      // console.log('swipe事件', e)
      if (e.direction === 'left' && ableNext) {
        setCurrentIndex(currentIndex + 1);
      }
      if (e.direction === 'right' && ablePrev) {
        setCurrentIndex(currentIndex - 1);
      }
    });
    at.on('panmove', (e) => {
      // console.log('pan事件', e.displacementX);
      let endX = parseInt((refStart.current.x + e.displacementX).toFixed(0)),
        endY = parseInt((refStart.current.y + e.displacementY).toFixed(0));
      const item = { x: endX, y: endY };
      if (e.displacementY !== 0 && refScale.current <= 1) {
        const rate = (window.innerHeight - Math.abs(e.displacementY)) / window.innerHeight;
        setScaleRate(rate);
        refScale.current = rate;
      }
      setTransInfo(item);
      refTrans.current = item;
    });
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
      if (refScale.current < config.mindScale) {
        onClose();
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
        if (x <= 0 && ableNext) {
          setCurrentIndex(currentIndex + 1);
        } else if (x > 0 && ablePrev) {
          setCurrentIndex(currentIndex - 1);
        }
      }
      if (refScale.current === config.scale) {
        onReset();
      }
    });
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
    at.on('pinchend', () => {
      if (refScale.current < 1) {
        onReset();
      }
    });
    return () => {
      at.destroy();
    };
  }, [currentIndex]);

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

  // 放大
  const zoomIn = () => {
    if (refScale.current < config.maxScale) {
      refScale.current = Math.min(refScale.current * 2, config.maxScale);
      setScaleRate(refScale.current);
    }
  };

  // 缩小
  const zoomOut = () => {
    if (refScale.current > config.minScale) {
      refScale.current = Math.max(refScale.current * 0.8, config.minScale);
      setScaleRate(refScale.current);
    }
  };

  // 还原
  const zoomReset = () => {
    if (refScale.current !== config.scale) {
      onReset();
    }
  };

  // 上一张
  const onPrev = () => {
    if (ablePrev) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // 下一张
  const onNext = () => {
    if (ableNext) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className={`${prefixCls}-image-root`} ref={refRoot}>
      {urls.map((item, i) => {
        return (
          <Image
            key={i}
            src={item}
            index={currentIndex}
            site={i}
            transInfo={transInfo}
            scaleRate={scaleRate}
            innerInfo={innerInfo}
            isTrans={isTrans}
          />
        );
      })}
      {urls.length > 1 && (
        <div className={`${prefixCls}-point-box`}>
          {new Array(urls.length).fill(0).map((item, i) => {
            return (
              <div
                className={`${prefixCls}-point-item`}
                onMouseDown={() => setCurrentIndex(i)}
                onTouchEnd={() => setCurrentIndex(i)}
                key={i}
              >
                <span
                  className={classnames(`${prefixCls}-point`, {
                    [`${prefixCls}-point-on`]: currentIndex === i,
                  })}
                />
              </div>
            );
          })}
        </div>
      )}
      {isPc && (
        <>
          <div className={`${prefixCls}-image-tools`}>
            <span
              className={`${prefixCls}-tools-btn ${prefixCls}-tools-reduce`}
              onMouseDown={zoomOut}
              onTouchEnd={zoomOut}
            />
            <span
              className={`${prefixCls}-tools-btn ${prefixCls}-tools-add`}
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
          </div>
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
