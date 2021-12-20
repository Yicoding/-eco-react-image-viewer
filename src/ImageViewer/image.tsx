import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ImageItem, Info } from '../utils/types';

import './styles.less';

const prefixCls = 'eco-image-viewer';

export default (props: ImageItem) => {
  const ref = useRef<any>();

  const { src, site, index, transInfo, scaleRate, isChange, innerInfo } = props;

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
  }, []);

  return (
    <div
      className={`${prefixCls}-image-slide ${isChange ? `${prefixCls}-slide-trans` : ''}`}
      style={Object.assign(
        {},
        {
          transform: `translate(calc(${-100 * (index - site)}% + ${
            scaleRate === 1 ? transInfo.x : index === site ? transInfo.x : 0
          }px), ${index === site ? transInfo.y : 0}px)`,
          '-webkit-transform': `translate(calc(${-100 * (index - site)}% + ${
            scaleRate === 1 ? transInfo.x : index === site ? transInfo.x : 0
          }px), ${index === site ? transInfo.y : 0}px)`,
          '-ms-transform': `translate(calc(${-100 * (index - site)}% + ${
            scaleRate === 1 ? transInfo.x : index === site ? transInfo.x : 0
          }px), ${index === site ? transInfo.y : 0}px)`,
          '-moz-transform': `translate(calc(${-100 * (index - site)}% + ${
            scaleRate === 1 ? transInfo.x : index === site ? transInfo.x : 0
          }px), ${index === site ? transInfo.y : 0}px)`,
          '-o-transform': `translate(calc(${-100 * (index - site)}% + ${
            scaleRate === 1 ? transInfo.x : index === site ? transInfo.x : 0
          }px), ${index === site ? transInfo.y : 0}px)`,
        },
      )}
    >
      <img
        src={src}
        className={`${prefixCls}-image-item`}
        style={Object.assign({}, imageSize, {
          transform: `translate(-50%, -50%) scale(${index === site ? scaleRate : 1}`,
          '-webkit-transform': `translate(-50%, -50%) scale(${index === site ? scaleRate : 1}`,
          '-ms-transform': `translate(-50%, -50%) scale(${index === site ? scaleRate : 1}`,
          '-moz-transform': `translate(-50%, -50%) scale(${index === site ? scaleRate : 1}`,
          '-o-transform': `translate(-50%, -50%) scale(${index === site ? scaleRate : 1}`,
        })}
        ref={ref}
      />
    </div>
  );
};
