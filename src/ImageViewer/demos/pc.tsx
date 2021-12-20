import React, { useState } from 'react';
import ImageViewer from '@eco/react-image-viewer';

import s from './styles.less';

import aLg from '../../assets/images/a-lg.png';
import aMd from '../../assets/images/a-md.png';
import xLg from '../../assets/images/x-lg.png';
import xMd from '../../assets/images/x-md.png';
import yLg from '../../assets/images/y-lg.png';
import yMd from '../../assets/images/y-md.png';

export default () => {
  const [visible, setVisible] = useState<boolean>(false);

  const onClose = () => setVisible((val) => !val);

  return (
    <div>
      <div className={s.btnPrimary} onClick={onClose}>
        预览
      </div>
      {visible && <ImageViewer urls={[aLg, aMd, xLg, xMd, yLg, yMd]} onClose={onClose} />}
    </div>
  );
};
