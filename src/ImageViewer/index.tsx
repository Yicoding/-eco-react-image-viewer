import React, { useEffect, useState, useRef } from 'react';

import AnyTouch from 'any-touch';

import Image from './image';
import { noon } from '../utils/tools';
import { ImageViewer, MoveInfo, Info } from '../utils/types';

import './styles.less';

const prefixCls = 'eco-image-viewer';

export default (props: ImageViewer) => {
  const refRoot = useRef<any>();
  const refScale = useRef<any>(1);
  const refTrans = useRef<any>({ x: 0, y: 0 });
  const refStart = useRef<MoveInfo>({ x: 0, y: 0 });
  const refTimer = useRef<any>();

  const { onClose = noon, index = 0, urls = [] } = props;

  const [currentIndex, setCurrentIndex] = useState<number>(index);
  const [transInfo, setTransInfo] = useState<MoveInfo>({ x: 0, y: 0 });
  const [scaleRate, setScaleRate] = useState<number>(1);
  const [isChange, setIsChange] = useState<boolean>(false);
  const [isPc, setIsPc] = useState<boolean>(false);
  const [innerInfo, setInnerInfo] = useState<Info>({
    width: 1,
    height: 1,
  });

  useEffect(() => {
    document.body.classList.add('fixed-body');
    return () => {
      document.body.classList.remove('fixed-body');
    };
  }, []);

  const dealChange = () => {
    setIsChange(true);
    setTimeout(() => {
      setIsChange(false);
    }, 200);
  };

  useEffect(() => {
    refStart.current = { x: 0, y: 0 };
    setTransInfo({ x: 0, y: 0 });
    refTrans.current = { x: 0, y: 0 };
    setScaleRate(1);
    refScale.current = 1;
    const at = new AnyTouch(refRoot.current);
    at.on('tap', (e) => {
      // console.log('tap事件', e);
      const target = e.target as HTMLTextAreaElement;
      if (/point|tools/.test(target.className)) {
        return;
      }
      if (refTimer.current) {
        clearTimeout(refTimer.current);
        refTimer.current = null;
        if (refScale.current === 1) {
          refScale.current = 2;
          setScaleRate(2);
        } else {
          setScaleRate(1);
          refStart.current = { x: 0, y: 0 };
          setTransInfo({ x: 0, y: 0 });
          refTrans.current = { x: 0, y: 0 };
          refScale.current = 1;
        }
        return;
      }
      refTimer.current = setTimeout(() => {
        onClose();
      }, 200);
    });
    at.on('swipe', (e) => {
      // console.log('swipe事件', e)
      if (e.direction === 'left' && currentIndex < urls.length - 1) {
        setCurrentIndex(currentIndex + 1);
        dealChange();
      }
      if (e.direction === 'right' && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
        dealChange();
      }
    });
    at.on('panmove', (e) => {
      // console.log('pan事件', e.displacementX);
      let x = e.displacementX,
        y = e.displacementY;
      let endX = parseInt((refStart.current.x + x).toFixed(0)),
        endY = parseInt((refStart.current.y + y).toFixed(0));
      const item = { x: endX, y: endY };
      setTransInfo(item);
      refTrans.current = item;
    });
    at.on('panend', (e) => {
      // console.log('pan事件', e.x);
      const x = refStart?.current?.x || 0;
      if (refScale.current !== 1) {
        refStart.current = {
          x: refStart.current.x + e.displacementX,
          y: refStart.current.y + e.displacementY,
        };
      }
      setTimeout(() => {
        setTransInfo({
          x: refScale.current === 1 ? 0 : refTrans.current.x,
          y: refScale.current === 1 ? 0 : refTrans.current.y,
        });
      }, 100);
      if (Math.abs(e.displacementX) / window.innerWidth > 1 / 3 && refScale.current === 1) {
        if (e.displacementX <= 0) {
          if (currentIndex < urls.length - 1) {
            setCurrentIndex(currentIndex + 1);
            dealChange();
          }
        } else {
          if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            dealChange();
          }
        }
      }
      if (refScale.current === 1) {
        refStart.current = { x: 0, y: 0 };
        setTransInfo({ x: 0, y: 0 });
        refTrans.current = { x: 0, y: 0 };
      }
    });
    at.on('pinchmove', (e) => {
      console.log('pinch', e.deltaScale);
      if (e.scale > 1) {
        // 放大
        refScale.current = Math.min(Math.round(refScale.current * e.deltaScale * 100) / 100, 4);
      } else {
        refScale.current = Math.max(Math.round(refScale.current * e.deltaScale * 100) / 100, 0.5);
      }
      setScaleRate(refScale.current);
    });
    return () => {
      at.destroy();
    };
  }, [currentIndex]);

  useEffect(() => {
    setInnerInfo({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    setIsPc(window.innerWidth > 420);
    window.addEventListener('resize', () => {
      setInnerInfo({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      setIsPc(window.innerWidth > 420);
    });
    return () => {
      window.removeEventListener('resize', () => {});
    };
  }, []);

  const zoomIn = () => {
    console.log('zoomIn', refScale.current);
    if (refScale.current < 4) {
      refScale.current = Math.min(refScale.current * 2, 4);
      setScaleRate(refScale.current);
    }
  };

  const zoomOut = () => {
    console.log('zoomOut', refScale.current);
    if (refScale.current > 0.5) {
      refScale.current = Math.max(refScale.current * 0.8, 0.5);
      setScaleRate(refScale.current);
    }
  };

  const zoomReset = () => {
    console.log('zoomReset', refScale.current);
    if (refScale.current !== 1) {
      refScale.current = 1;
      setScaleRate(1);
      refStart.current = { x: 0, y: 0 };
      setTransInfo({ x: 0, y: 0 });
      refTrans.current = { x: 0, y: 0 };
    }
  };

  const onPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((val) => val - 1);
      dealChange();
    }
  };

  const onNext = () => {
    if (currentIndex < urls.length - 1) {
      setCurrentIndex((val) => val + 1);
      dealChange();
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
            isChange={isChange}
            innerInfo={innerInfo}
          />
        );
      })}
      {urls.length > 1 && (
        <div className={`${prefixCls}-point-box`}>
          {new Array(urls.length).fill(0).map((item, i) => {
            return (
              <span
                key={i}
                className={`${prefixCls}-point ${
                  currentIndex === i ? `${prefixCls}-point-on` : ''
                }`}
                onMouseDown={() => {
                  console.log('point mouse', i);
                  setCurrentIndex(i);
                  dealChange();
                }}
                onTouchEnd={() => {
                  console.log('point Touch', i);
                  setCurrentIndex(i);
                  dealChange();
                }}
              />
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
          </div>
          <div
            className={`${prefixCls}-tools-arrow ${prefixCls}-tools-left`}
            onMouseDown={onPrev}
            onTouchEnd={onPrev}
          />
          <div
            className={`${prefixCls}-tools-arrow ${prefixCls}-tools-right`}
            onMouseDown={onNext}
            onTouchEnd={onNext}
          />
        </>
      )}
    </div>
  );
};
