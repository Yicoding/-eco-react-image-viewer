---
mobile: false
nav:
  title: PC 端
  path: /image-preview/pc
group:
  title: PC 端
---

# PC 端

## 示例

<code src="./demos/pc" />

## API

| 属性          | 说明               | 类型                    | 默认值  |
| :------------ | :----------------- | :---------------------- | :------ |
| urls          | 图片数组           | `string[]`              | `[]`    |
| visible       | 控制显示/隐藏      | `boolean`               | `false` |
| onClose       | 关闭预览回调       | `() => void`            | -       |
| index         | 当前展示图片的下标 | `number`                | `0`     |
| onIndexChange | 图片切换回调       | `(val: number) => void` | -       |
