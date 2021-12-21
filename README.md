# eco-react-image-viewer

[![npm][npm]][npm-url] ![GitHub](https://shopmushi.com/configFile/assets/mit.svg)

基于`react`的图片预览组件，兼容 PC、移动端

[查看文档和示例][site]

## 使用

### npm 或 yarn 安装

```bash
npm install eco-react-image-viewer --save
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

### API

| 属性          | 说明               | 类型                    | 默认值  |
| :------------ | :----------------- | :---------------------- | :------ |
| urls          | 图片数组           | `string[]`              | `[]`    |
| visible       | 控制显示/隐藏      | `boolean`               | `false` |
| onClose       | 关闭预览回调       | `() => void`            | -       |
| index         | 当前展示图片的下标 | `number`                | `0`     |
| onIndexChange | 图片切换回调       | `(val: number) => void` | -       |

[npm]: https://img.shields.io/npm/v/eco-react-image-viewer.svg
[npm-url]: https://www.npmjs.com/package/eco-react-image-viewer
[site]: https://yicoding.github.io/eco-react-image-viewer
