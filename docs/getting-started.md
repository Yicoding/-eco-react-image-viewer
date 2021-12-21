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
yarn add eco-react-image-viewer
```

or

```bash
yarn add eco-react-image-viewer
```

### 示例

```ts
import React, { useState } from 'react';
import ImageViewer from 'eco-react-image-viewer';

import aLg from '../../fixtures/images/a-lg.png';
import aMd from '../../fixtures/images/a-md.png';
import xLg from '../../fixtures/images/x-lg.png';
import xMd from '../../fixtures/images/x-md.png';
import yLg from '../../fixtures/images/y-lg.png';
import yMd from '../../fixtures/images/y-md.png';

export default () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);

  const onClose = () => setVisible((val) => !val);

  return (
    <div>
      <div onClick={onClose}>预览</div>
      <ImageViewer
        visible={visible}
        urls={[aLg, aMd, xLg, xMd, yLg, yMd]}
        onClose={onClose}
        index={index}
        onIndexChange={setIndex}
      />
    </div>
  );
};
```

[npm]: https://img.shields.io/npm/v/eco-react-image-viewer.svg
[npm-url]: https://www.npmjs.com/package/eco-react-image-viewer
