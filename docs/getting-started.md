---
title: 快速上手
group:
  title: 快速上手
nav:
  title: 指南
  path: /docs
---

# 快速上手

[![npm][npm]][npm-url] ![GitHub](@/fixtures/svg/mit.svg)

## 使用

### npm 或 yarn 安装

```bash
npm install react-image-view
# or
yarn add react-image-view
```

### 示例

```ts
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
```

[npm]: https://img.shields.io/npm/v/react-image-view.svg
[npm-url]: https://www.npmjs.com/package/react-image-view
