---
title: 快速上手
order: 0
group:
  title: 快速上手
nav:
  title: 指南
  path: /docs
---

# 快速上手

[![npm][npm]][npm-url] ![GitHub](@/assets/svg/mit.svg)

## 使用

### npm 或 yarn 安装

```bash
npm install @eco/react-image-viewer
# or
yarn add @eco/react-image-viewer
```

### 示例

```javascript
import React, { useState } from 'react';
import ImageViewer from '@eco/react-image-viewer';

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

  return <ImageViewer index={index} urls={urls} onClose={onClose} />;
};
```

[npm]: https://img.shields.io/npm/v/react-image-viewer.svg
[npm-url]: https://www.npmjs.com/package/react-image-viewer
