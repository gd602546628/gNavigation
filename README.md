# gNavigation
vue模拟原生导航


## 此组件使用keep-alive模拟原生导航，调用```router.push```  ```router.replace```为前进，其他改变路由的方式视为后退
### 使用

```javascript
Vue.use(gNavigation, {router})

```
将<router-view>替换为<g-navigation :useTransition="true">

useTransition参数为是否使用页面切换动画（默认false），inName参数，前进时过渡动画名称，outName参数，回退时过渡动画名称

