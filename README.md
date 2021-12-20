# eco-react-image-viewer

[![npm][npm]][npm-url] ![GitHub](https://shopmushi.com/configFile/assets/mit.svg)

基于`react`的图片预览组件，兼容 PC、移动端

[查看文档和示例][site]

## 使用

### npm 或 yarn 安装

```shell
npm install eco-react-image-viewer
# or
yarn add eco-react-image-viewer
```

### 示例

```ts
import React, { useState } from 'react';
import ImageViewer from 'eco-react-image-viewer';

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
      <ImageViewer visible={visible} urls={[aLg, aMd, xLg, xMd, yLg, yMd]} onClose={onClose} />
    </div>
  );
};
```

[npm]: https://img.shields.io/npm/v/eco-react-image-viewer.svg
[npm-url]: https://www.npmjs.com/package/eco-react-image-viewer
[site]: https://yicoding.github.io/eco-react-image-viewer
