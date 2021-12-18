import React, { useState } from 'react';
import { Button } from 'antd-mobile';
import ImageViewer from '@eco/react-image-viewer';

import aLg from '../../../assets/images/a-lg.png';
import aSm from '../../../assets/images/a-sm.png';
import xLg from '../../../assets/images/x-lg.png';
import xSm from '../../../assets/images/x-sm.png';
import yLg from '../../../assets/images/y-lg.png';
import ySm from '../../../assets/images/y-sm.png';

export default () => {
  const [visible, setVisible] = useState<boolean>(false);

  const onClose = () => setVisible((val) => !val);

  return (
    <div>
      <Button color="primary" onClick={onClose}>
        Primary
      </Button>
      {visible && <ImageViewer urls={[aLg, aSm, xLg, xSm, yLg, ySm]} onClose={onClose} />}
    </div>
  );
};
