/**
 * Created by gd on 2017/9/15/015.
 */
import gNavigation from './gNavigation'
export default {
  install: (Vue, {router} = {}) => {
    let flagName = 'isPush'
    if (!router) {
      console.error('router参数必填')
      return
    }
    router.options.routes.forEach((route) => {
      if (route.component && (route.component.name != route.name)) {
        console.error(`${route.name}这个名字的路由和它组件名字不同`)
      }
    })
    let pushCopy = router.push
    let replaceCopy = router.replace
    // 重写push和replace方法，vue中调用这两个方法说明是路由前进
    router.push = function () {
      this[flagName] = true
      pushCopy.call(this, ...arguments)
    }
    router.replace = function () {
      this[flagName] = true
      replaceCopy.call(this, ...arguments)
    }
    let bus = new Vue()
    router.beforeEach((to, from, next) => {
      router.isPush
        ? bus.$emit('add', from.name)
        : bus.$emit('remove', from.name)
      setTimeout(() => {
        next()
      }, 0)
    })
    Vue.component('gNavigation', gNavigation(bus))
  }
}
