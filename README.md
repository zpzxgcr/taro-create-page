### Taro小程序根据配置的路径生成初始化的模板
* 支持生成class 和 hooks 的模板
* 检测配置改动自动生成
* 直接taro插件配置

用法
```shell
> npm install -D  taro-create-page
```
> 默认生成 是class 组件模板
```javascript
//在项目 config/index.js配置
const AutoCreatePage = require('taro-create-page')

{
...

  plugins: [
    new AutoCreatePage()
  ]

...
}
```

> 如果需要初始化生成hooks 模板 请在你的项目路径配置后面加上注释
```tsx
...

 config: Config = {
    pages: [
      'pages/index/index', /* 首页 */
      'pages/exchange/index', /* 我的变化 */
      'pages/login/index', /* 登录 ishooks*/
      'pages/my-reward/index',
      'pages/rank/index', /* 排行榜 */
      'pages/result/index', /* 题目分数 */
      'pages/topic/index' /* 题目首页 */

    ]

  ...
```
**上面 路径后面的注释 包含中文便是新建模板的navigationBarTitleText, 否则默认路径**

适用于项目初始化 设计好目录路径结构 自动 生成目录路径
原有项目开发的时候 不需要新建文件夹 模板 然后 再去添加路径
自动完成
