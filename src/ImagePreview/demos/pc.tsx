import React, { useState } from 'react';
import ImagePreview from 'react-image-view';

import s from './styles.less';

import aLg from '../../fixtures/images/a-lg.png';
import aMd from '../../fixtures/images/a-md.png';
import xLg from '../../fixtures/images/x-lg.png';
import xMd from '../../fixtures/images/x-md.png';
import yLg from '../../fixtures/images/y-lg.png';
import yMd from '../../fixtures/images/y-md.png';

export default () => {
  const [visible, setVisible] = useState<boolean>(false);

  const onClose = () => setVisible((val) => !val);

  return (
    <div>
      <div className={s.btnPrimary} onClick={onClose}>
        预览
      </div>
      {visible && <ImagePreview urls={[aLg, aMd, xLg, xMd, yLg, yMd]} onClose={onClose} />}
    </div>
  );
};
