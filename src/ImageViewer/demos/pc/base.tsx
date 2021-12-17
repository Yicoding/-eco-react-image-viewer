import React from 'react';
import ImageViewer from '@eco/react-image-viewer';

import aLg from '../../../assets/images/a-lg.png';
import aSm from '../../../assets/images/a-sm.png';
import xLg from '../../../assets/images/x-lg.png';
import xSm from '../../../assets/images/x-sm.png';
import yLg from '../../../assets/images/y-lg.png';
import ySm from '../../../assets/images/y-sm.png';

export default () => {
  return (
    <ImageViewer
      // urls={[aLg]}
      // urls={[aSm]}
      // urls={[xLg]}
      // urls={[xSm]}
      // urls={[yLg]}
      urls={[
        aLg,
        aSm,
        xLg,
        xSm,
        yLg,
        ySm,
        aLg,
        aSm,
        xLg,
        xSm,
        yLg,
        ySm,
        aLg,
        aSm,
        xLg,
        xSm,
        yLg,
        ySm,
        aLg,
        aSm,
        xLg,
        xSm,
        yLg,
        ySm,
      ]}
    />
  );
};
