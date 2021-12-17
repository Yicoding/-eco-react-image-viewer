import React, { useEffect, useState } from 'react';

import Image from './image';
import { noon } from '../utils/tools';
import { ImageViewer } from '../utils/types';

import './styles.less';

export default (props: ImageViewer) => {
  const { onClose = noon, index = 0, urls = [] } = props;

  const [currentIndex, setCurrentIndex] = useState<number>(index);

  useEffect(() => {
    document.body.classList.add('fixed-body');
    return () => {
      document.body.classList.remove('fixed-body');
    };
  }, []);

  return (
    <div className="image-root">
      {urls.map((item, i) => {
        return <Image key={i} src={item} index={currentIndex} site={i} />;
      })}
      {urls.length > 1 && (
        <div className="point-box">
          {new Array(urls.length).fill(0).map((item, i) => {
            return (
              <span
                key={i}
                className={`point ${currentIndex === i ? 'point-on' : ''}`}
                onClick={() => setCurrentIndex(i)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
