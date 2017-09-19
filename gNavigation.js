/**
 * Created by gd on 2017/9/18/018.
 */
import './gNavigation.css'
export default (bus) => {
  return {
    template: `<transition :name="actionName" @before-enter="beforeEnter">
                  <keep-alive :exclude="exclude">
                     <router-view></router-view>
                   </keep-alive>
                </transition>`,
    props: {
      useTransition: {
        type: Boolean,
        default: false
      },
      inName: {
        type: String,
        default: 'gd-fly'
      },
      outName: {
        type: String,
        default: 'gd-leaveFly'
      }
    },
    created(){
      bus.$on('add', (name) => {
        this.exclude.indexOf(name) >= 0 && this.exclude.splice(this.exclude.indexOf(name), 1)
      })
      bus.$on('remove', (name) => {
        this.exclude.indexOf(name) < 0 && this.exclude.push(name)
      })
      setTimeout(() => {
        this.canTransition = true
      }, 300)
    },
    data(){
      return {
        actionName: 'fly',
        exclude: [],
        canTransition: false
      }
    },
    methods: {
      beforeEnter(){
        // 组件创建后，将路由标记置为false
        this.$router.isPush = false
      }
    },
    watch: {
      '$route': {
        handler(){
          if (!this.canTransition) {
            this.actionName = ''
            return
          }
          if (this.useTransition) {
            this.actionName = this.$router.isPush ? this.inName : this.outName
          } else {
            this.actionName = ''
          }
        }
      }
    }
  }
}
