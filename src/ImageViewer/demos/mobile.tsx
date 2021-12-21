import React, { useState } from 'react';
import ImageViewer from 'eco-react-image-viewer';

import s from './styles.less';

import aLg from '../../fixtures/images/a-lg.png';
import aSm from '../../fixtures/images/a-sm.png';
import xLg from '../../fixtures/images/x-lg.png';
import xSm from '../../fixtures/images/x-sm.png';
import yLg from '../../fixtures/images/y-lg.png';
import ySm from '../../fixtures/images/y-sm.png';

export default () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);

  const onClose = () => setVisible((val) => !val);

  return (
    <div>
      <div className={s.btnPrimary} onClick={onClose}>
        预览
      </div>
      <ImageViewer
        visible={visible}
        urls={[aLg, aSm, xLg, xSm, yLg, ySm]}
        onClose={onClose}
        index={index}
        onIndexChange={setIndex}
      />
    </div>
  );
};
