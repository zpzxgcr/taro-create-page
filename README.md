### Taro小程序根据配置的路径生成初始化的模板
* 支持生成class 和 hooks 的模板
* 检测配置改动自动生成
* 直接taro插件配置

用法
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
适用于项目初始化 设计好目录路径结构 自动 生成目录路径
原有项目开发的时候 不需要新建文件夹 模板 然后 再去添加路径
自动完成
