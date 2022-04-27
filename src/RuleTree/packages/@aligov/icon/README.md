# 政务扩展图标

@aligov/icon

支持同时使用 Fusion 内置图标以及[数字政务图标系统][gov-icon-collection] 的图标组件，除了 `custom` 属性外，其他属性和 [Fusion Icon][fusion-icon] 的用法一致。

## API

| 参数名 | 说明               | 必填 | 类型    | 默认值 | 备注                     |
| ------ | ------------------ | ---- | ------- | ------ | ------------------------ |
| custom | 是否使用自定义图标 |      | boolean | false  | 默认使用 fusion 内置图标 |
| type   | 图标编码代号       |      | string  |        |                          |

## 其他事项

新增图标后，需要更新[图标项目][gov-icon-project]里 `Symbol` 链接，并更新该组件 package.json 里的 `iconScriptUrl`。

在无法更新组件的情况下，可以通过在组件加载前设置全局变量来定制。

执行`npm start` 和 `npm publish` 时，会前置执行`npm run updateIcon`，来下载`iconScriptUrl`指向的资源至本地，打包时会用本地资源进行构建。

`npm run updateIcon` 依赖 `curl`命令。

执行命令后请检查`iconfont.js`是否有内容，如果没有则有可能是`curl`命令缺失，请手动复制`iconScriptUrl`指向的资源内容至`iconfont.js`，或安装`curl`并重新执行`npm run updateIcon` 。

### 全局变量

- `CUSTOM_ICONFONT_JS`：iconfont Symbol js 地址，如 `//at.alicdn.com/t/font_1432938_9mhelv05j69.js`
- `CUSTOM_ICON_FIEFIX`：自定义图标 symbol 前缀，如 `gov-icon-`。这样对于图标 `gov-icon-yiju`，在使用时 `type` 设为 `yiju`。

> 数字政务图标系统及 iconfont 项目由设计师维护，图标系统（collection）是可公开访问的，图标可能比项目中的少一些（放到主题中了）。该组件中使用的是项目（project）中的所有图标。

[fusion-icon]: https://fusion.design/pc/component/basic/icon
[gov-icon-collection]: https://www.iconfont.cn/collections/detail?cid=18867
[gov-icon-project]: https://www.iconfont.cn/manage/index?manage_type=myprojects&projectId=1432938
