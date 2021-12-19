import React, { useEffect, useState, useRef } from 'react';

import AnyTouch from 'any-touch';

import Image from './image';
import { noon, isPc } from '../utils/tools';
import { ImageViewer, MoveInfo } from '../utils/types';

import './styles.less';

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

  useEffect(() => {
    document.body.classList.add('fixed-body');
    return () => {
      document.body.classList.remove('fixed-body');
    };
  }, []);

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
      }
      if (e.direction === 'right' && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    });
    at.on('panmove', (e) => {
      console.log('pan事件', e.displacementX);
      let x = 0,
        y = 0;
      if (e.displacementX < 0) {
        x = Math.max(e.displacementX, -window.innerWidth / 5);
      } else {
        x = Math.min(e.displacementX, window.innerWidth / 5);
      }
      if (e.displacementY < 0) {
        y = Math.max(e.displacementY, -window.innerHeight / 5);
      } else {
        y = Math.min(e.displacementY, window.innerHeight / 5);
      }
      let endX = 0,
        endY = 0;
      const currentX = refStart.current.x + x;
      const currentY = refStart.current.y + y;
      if (currentX >= 0) {
        endX = Math.min(currentX, window.innerWidth / 2);
      } else {
        endX = Math.max(currentX, -window.innerWidth / 2);
      }
      if (currentY >= 0) {
        endY = Math.min(currentY, window.innerWidth / 2);
      } else {
        endY = Math.max(currentY, -window.innerWidth / 2);
      }
      endX = parseInt(endX.toFixed(0));
      endY = parseInt(endY.toFixed(0));
      const item = { x: endX, y: endY };
      requestAnimationFrame(() => {
        setTransInfo(item);
        refTrans.current = item;
      });
    });
    at.on('panend', (e) => {
      // console.log('pan事件', e.x);
      const x = refStart?.current?.x || 0;
      // console.log('move end', e, e.x - x);
      refStart.current = {
        x: refStart.current.x + e.displacementX,
        y: refStart.current.y + e.displacementY,
      };
      setTimeout(() => {
        setTransInfo({
          x: refScale.current === 1 ? 0 : refTrans.current.x,
          y: refScale.current === 1 ? 0 : refTrans.current.y,
        });
      }, 100);
      if (Math.abs(e.x - x) / window.innerWidth > 1 / 3 && refScale.current === 1) {
        if (e.x - x <= 0) {
          if (currentIndex < urls.length - 1) {
            setCurrentIndex(currentIndex + 1);
          }
        } else {
          if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
          }
        }
      }
    });
    at.on('pinchmove', (e) => {
      console.log('pinch', e.scale);
      requestAnimationFrame(() => {
        if (e.scale > 0.5 && e.scale < 3) {
          setScaleRate(e.scale);
        }
      });
      refScale.current = e.scale;
    });
    return () => {
      at.destroy();
    };
  }, [currentIndex]);

  const zoomIn = () => {
    console.log('zoomIn', refScale.current);
    if (refScale.current < 3) {
      refScale.current = Math.min(refScale.current * 2, 3);
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
    }
  };

  const onNext = () => {
    if (currentIndex < urls.length - 1) {
      setCurrentIndex((val) => val + 1);
    }
  };

  const onTouchMove = (e: any) => {
    console.log('onTouchMove', e.touches[0].clientX);
  };

  return (
    <div className="image-root" ref={refRoot} onTouchMove={onTouchMove}>
      {urls.map((item, i) => {
        return (
          <Image
            key={i}
            src={item}
            index={currentIndex}
            site={i}
            transInfo={transInfo}
            scaleRate={scaleRate}
          />
        );
      })}
      {urls.length > 1 && (
        <div className="point-box">
          {new Array(urls.length).fill(0).map((item, i) => {
            return (
              <span
                key={i}
                className={`point ${currentIndex === i ? 'point-on' : ''}`}
                onMouseDown={() => {
                  console.log('point mouse', i);
                  setCurrentIndex(i);
                }}
                onTouchEnd={() => {
                  console.log('point Touch', i);
                  setCurrentIndex(i);
                }}
              />
            );
          })}
        </div>
      )}
      {isPc && (
        <>
          <div className="image-tools">
            <span className="tools-btn tools-reduce" onMouseDown={zoomOut} onTouchEnd={zoomOut} />
            <span className="tools-btn tools-add" onMouseDown={zoomIn} onTouchEnd={zoomIn} />
            <div className="tools-reset" onMouseDown={zoomReset} onTouchEnd={zoomReset}>
              重置
            </div>
          </div>
          <div className="tools-arrow tools-left" onMouseDown={onPrev} onTouchEnd={onPrev} />
          <div className="tools-arrow tools-right" onMouseDown={onNext} onTouchEnd={onNext} />
        </>
      )}
    </div>
  );
};
