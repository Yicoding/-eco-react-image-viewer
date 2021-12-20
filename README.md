# react-image-view

[![npm][npm]][npm-url] ![GitHub](https://shopmushi.com/configFile/assets/mit.svg)

基于`react`的图片预览组件，兼容 PC、移动端

[查看文档和示例][site]

## 使用

### npm 或 yarn 安装

```shell
npm install react-image-view
# or
yarn add react-image-view
```

### 示例

```javascript
import React, { useState } from 'react';
import ImagePreview from 'react-image-view';

type FileItem = {
  url: string, // 图片url
  loading?: boolean, // 图片是否加载中
  errorTip?: string, // 错误提示
  name?: string, // 文件说明
  fileName?: string, // 文件名称,包含后缀
  [index: string]: any
};

export default () => {
  const [value, setValue] = useState<FileItem[]>([]);

  // 数组改变
  const onChange = (arr: FileItem[]) => setValue(arr);

  return <ImagePreview index={index} urls={urls} onClose={onClose} />;
};
```

[npm]: https://img.shields.io/npm/v/react-image-view.svg
[npm-url]: https://www.npmjs.com/package/react-image-view
[site]: https://yicoding.github.io/react-image-view
