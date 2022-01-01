import React, { useState, useEffect, useMemo } from 'react';
import classnames from 'classnames';
import { ImageItem, Info } from '../utils/types';

import './styles.less';

import iconLoading from '../assets/icon_loading.png';

const prefixCls = 'eco-image-viewer';

export default (props: ImageItem) => {
  const { src, site, index, transInfo, scaleRate, innerInfo, isTrans, visible, rotateVal } = props;

  const [url, setUrl] = useState<string>('');
  const [imageInfo, setImageInfo] = useState<Info>({
    width: 50,
    height: 50,
  });
  const [isShow, setIsShow] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      setIsShow(visible);
    }, 0);
  }, [visible]);

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
    setUrl('');
    const image = new Image();
    // 监听目标图片加载的情况，完成时再将DOM上的img节点的src属性设置为目标图片的url
    image.onload = () => {
      setImageInfo({
        width: image.width,
        height: image.height,
      });
      setUrl(src);
    };
    // 设置src属性，Image实例开始加载图片
    image.src = src;
  }, [src]);

  return (
    <div
      className={classnames(`${prefixCls}-image-slide`, {
        [`${prefixCls}-image-slide-trans`]: isShow,
      })}
      style={{
        transform: `translate(calc(${-100 * (index - site)}%), 0) rotate(${
          index === site ? rotateVal : 0
        }deg)`,
      }}
    >
      <img
        src={url || iconLoading}
        className={classnames(
          `${prefixCls}-image-item`,
          { [`${prefixCls}-loading`]: !url },
          { [`${prefixCls}-trans`]: isTrans },
        )}
        style={Object.assign(
          {},
          imageSize,
          url && {
            transform: `translate(calc(-50% + ${
              scaleRate === 1 ? transInfo.x : index === site ? transInfo.x : 0
            }px), calc(-50% + ${index === site ? transInfo.y : 0}px)) scale(${
              visible ? (index === site ? scaleRate : 1) : 0.5
            }`,
          },
        )}
      />
    </div>
  );
};
