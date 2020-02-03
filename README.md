# react-admin

---
## 项目介绍

中品优购商城中台前端

---
|主要技术栈|说明|
|:-|:-|
|[react](https://react.docschina.org/)|前端框架|
|[react-router](https://reacttraining.com/react-router/web/guides/quick-start)|React路由框架|
|[redux](https://www.redux.org.cn/)|状态管理|
|[antd](https://ant.design/docs/react/introduce-cn)|React UI组件库|
|[webpack](https://www.webpackjs.com/concepts/)|模块打包器|
|[babel](https://www.babeljs.cn/docs/index.html)|JavaScript编译器|
|[ESLint](https://cn.eslint.org/)|javascript代码检测工具|
|[propTypes](https://react.docschina.org/docs/typechecking-with-proptypes.html)|类型检查|

## 使用说明

1. 安装nodejs
2. 推荐安装yarn(yarn是Facebook提供的替代npm的工具)
[安装方式](https://yarn.bootcss.com/docs/install/#windows-stable)
```
#安装完 yarn 后设置镜像源
yarn config set registry https://registry.npm.taobao.org --global
yarn config set disturl https://npm.taobao.org/dist --global
```
3. clone原始项目分支
```
git clone ssh://git@gitee.com:locke_jay/react-admin.git
```
4. 安装依赖
```
yarn
<!-- or -->
npm install
```
4. 开发模式
```
yarn run dev
<!-- or -->
npm run dev
```
5. 打包

## 目录解析

```
|____src                    #开发源码目录
| |____assets               #静态资源————全局样式，图片，第三方js库
| |____components           #UI组件————项目组件，其他项目也会通用的组件，eg：加载组件，弹窗组件
| |____configs              #配置————项目参数配置 eg：请求接口api地址
| | |____api.config.js      #接口配置
| | |____route.config.js    #路由配置
| |____constants            #常量定义————项目常量定义 eg: 提示语
| |____http                 #http请求————统一数据请求封装
| |____redux                #redux相关
| |____utils                #公共函数
| |____views                #视图
| | |____common             #页面公用组件
| | |____layout             #页面布局
| | |____routes             #模块
| | | |____index.js         #路由入口
| | |____index.ejs          #index.html文件
| |____main.js              #入口文件
|____README.md              #说明文档
|____webpack.config.js      #webpack配置文件
```

## 依赖库介绍

## 编码规范

#### 模块规范
1. 单独模块单独一个文件夹放相关页面和组件
2. 使用index.js作为模块入口文件，需要写注释头：注明谁负责；模块内文件夹和文件功能

#### 命名规范
1. 不使用拼音
2. 目录命名：小写字母或者中划线 eg: footer, footer-bar
3. 文件命名: 
   * 组件文件名和样式文件名使用大驼峰命名法，且命名一致 eg: Login.jsx 、Login.less
   * 其他文件如公用函数等使用小驼峰命名 eg：systemApi 
4. className命名：使用中划线 eg: block-element-modifier
5. 变量，函数命名：统一使用小驼峰，eg: bannerRender
6. 接口命名: 小驼峰

#### 代码规范
1. render函数尽量避免处理逻辑，有需要直接写成方法处理，不在render中修改state或props
2. 写注释，方法修改时要更新注释
3. 纯组件不要继承BaseComponent，应继承React.PureComponent
4. 函数与函数之间空一行
5. 将state写在constructor外面，constructor需要才写，一旦有constructor，就必须要有super
6. 函数功能应职责单一，不存在副作用，是否是纯函数
7. 使用箭头函数创建组件内的方法，不需要使用bind绑定回调函数     [参考](https://react.docschina.org/docs/handling-events.html)
8. 使用PropTypes进行类型检查

#### url规范
1. URl结尾不应包含（/）
2. 正斜杠分隔符（/）必须用来指示层级关系
3. 应使用连字符（ - ）来提高URI的可读性
4. 不得在URI中使用下划线（_）
5. URI路径中全都使用小写字母



