# 工作台移动端

## 项目结构
``` 
    --build                      // 项目打包的目录
    |---lib                  // 一些外部库 
    |---static               // 打包生成的静态资源
        |--- js           
        |--- css             
    |---index.html           // 打包生成入口html 
    |---index.jsp            // 服务器部署的对应页面 改成jsp 为了方便java后台 往页面内注入数据.拿到一些用户的参数
    |---status.css           // 对应public 文件中的 资源
    --config                     //一些项react项目的配置文件
    --public
    |---lib                  // 静态库 直接引入到index.html入口文件中 不参与 react项目的 编译
    |---index.html           // 入口html文件 
    --src                        // 开发目录
    |---actions              // 对应redux 中的所有action 异步操作 在action中完成
    |---ajax                 
        |---api            // 所有接口信息
        |---index.js       // 使用axios 封装的统一请求 
    |---components                 // 一些react组件                 
    |---config               // 一些开发配置文件
    |---mobileInterface      // 与iOS 安卓进行 交互的接口框架   (当前未涉及交互 没有使用, token认证信息 由java后台 注入到index.jsp中)
    |---pages                // 对应页面 这里只有 主页 和 选择应用的界面
    |---reducers             // 对应redux 中的reducer
    |---styles               // 所有的样式文件
    |---app.jsx              // 整个react的根文件
    |---index.js             // 整个项目的根文件 
```


## v1.0
1. 小应用的展示.
2. 点击小应用右上角的箭头可以收起小应用
3. 进入编辑模式 可以切换小应用
  *  > 具体编辑流程是: 进入编辑模式-> 重新获取编辑模式下的数据 -> 添加/编辑小应用 -> 选择应用页面 -> 确定 -> 返回主页的编辑模式 -> 提交 -> 退出编辑模式 -> 重新获取主页数据

