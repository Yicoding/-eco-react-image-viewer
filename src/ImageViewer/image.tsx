import React, { useState, useEffect, useMemo, useRef } from 'react';
import AnyTouch from 'any-touch';
import { ImageItem } from '../utils/types';

import './styles.less';

type Info = {
  width: number;
  height: number;
};

export default (props: ImageItem) => {
  const ref = useRef<any>();

  const { src, site, index } = props;

  const [innerInfo, setInnerInfo] = useState<Info>({
    width: 1,
    height: 1,
  });
  const [imageInfo, setImageInfo] = useState<Info>({
    width: 1,
    height: 1,
  });

  const rateInner = innerInfo.width / innerInfo.height;
  const rateImage = imageInfo.width / imageInfo.height;

  const imageSize = useMemo(() => {
    if (rateImage > rateInner) {
      // 图片比浏览器更宽，上下留白
      return {
        width: Math.min(imageInfo.width, innerInfo.width),
      };
    } else {
      // 图片比浏览器更高，左右留白
      return {
        height: Math.min(imageInfo.height, innerInfo.height),
      };
    }
  }, [rateImage, rateInner, innerInfo, imageInfo]);

  useEffect(() => {
    const image = new Image();
    // 监听目标图片加载的情况，完成时再将DOM上的img节点的src属性设置为目标图片的url
    image.onload = () => {
      setImageInfo({
        width: image.width,
        height: image.height,
      });
    };
    // 设置src属性，Image实例开始加载图片
    image.src = src;
    const at = new AnyTouch(ref.current);
    at.on('tap', (e) => console.log('tap事件', e));
    at.on('swipe', (e) => console.log('swipe事件', e));
    at.on('pan', (e) => console.log('pan事件', e));
  }, []);

  useEffect(() => {
    setInnerInfo({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    window.addEventListener('resize', () => {
      setInnerInfo({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    });
    return () => {
      window.removeEventListener('resize', () => {});
    };
  }, []);

  return (
    <div
      className="image-slide"
      style={{
        transform: `translateX(${-100 * (index - site)}%)`,
      }}
    >
      <img src={src} className="image-item" style={imageSize} ref={ref} />
    </div>
  );
};
