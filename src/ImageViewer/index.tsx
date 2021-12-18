import React, { useEffect, useState, useRef } from 'react';

import AnyTouch from 'any-touch';

import Image from './image';
import { noon } from '../utils/tools';
import { ImageViewer, MoveInfo } from '../utils/types';

import './styles.less';

export default (props: ImageViewer) => {
  const refRoot = useRef<any>();
  const refScale = useRef<any>();
  const refStart = useRef<MoveInfo>({ x: 0, y: 0 });
  const refMove = useRef<MoveInfo>({ x: 0, y: 0 });
  const refTimee = useRef<any>();

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
    refMove.current = { x: 0, y: 0 };
    setTransInfo({ x: 0, y: 0 });
    const at = new AnyTouch(refRoot.current);
    at.on('tap', (e) => {
      // console.log('tap事件', e);
      const target = e.target as HTMLTextAreaElement;
      if (/point/.test(target.className)) {
        return;
      }
      onClose();
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
      // console.log('pan事件', e.x);
      const x = refStart?.current?.x || 0;
      const y = refStart?.current?.y || 0;
      if (x || y) {
        refMove.current = {
          x: e.x,
          y: e.y,
        };
        if (!((e.x - x) % 5) && !refTimee.current) {
          refTimee.current = setTimeout(() => {
            // console.log('pan事件', e.x);
            setTransInfo({
              x: e.x - x,
              y: e.y - y,
            });
            refTimee.current = null;
          }, 50);
        }
      } else {
        refStart.current = {
          x: e.x,
          y: e.y,
        };
      }
    });
    at.on('panend', (e) => {
      // console.log('pan事件', e.x);
      const x = refStart?.current?.x || 0;
      const y = refStart?.current?.y || 0;
      // console.log('move end', e, e.x - x);
      refStart.current = { x: 0, y: 0 };
      refMove.current = { x: 0, y: 0 };
      setTimeout(() => {
        setTransInfo({ x: 0, y: 0 });
      }, 100);
      if (Math.abs(e.x - x) / window.innerWidth > 1 / 3 && refScale.current !== 1) {
        if (e.x - x <= 0) {
          if (currentIndex < urls.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setTransInfo({ x: 0, y: 0 });
          }
        } else {
          if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setTransInfo({ x: 0, y: 0 });
          }
        }
      }
    });
    at.on('pinchmove', (e) => {
      console.log('pinch', e);
      setScaleRate(e.scale);
      refScale.current = e.scale;
    });
    return () => {
      setTransInfo({ x: 0, y: 0 });
      setScaleRate(1);
      refScale.current = 1;
      at.destroy();
    };
  }, [currentIndex]);

  return (
    <div className="image-root" ref={refRoot}>
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
    </div>
  );
};
