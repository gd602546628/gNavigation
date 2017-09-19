<template>
  <div class="gd-page" :style="initStyle">
    <div class="gd-header">
      <slot name="header"></slot>
    </div>
    <div class="gd-main" ref="_main" @scroll="onScroll">
      <div class="gd-scroll-wrap"
           :style="translateStyle"
           :class="{isDropped:dropped}"
           ref="scrollWrap"
      >
        <div class="load-wrap" v-if="dropFn">
          <slot name="loadMore-up" v-if="dropFlag==0">
            <div>下拉刷新</div>
          </slot>
          <slot name="loadMore-down" v-if="dropFlag==1">
            <div>释放刷新</div>
          </slot>
          <slot name="loadMore-loading" v-if="dropFlag==2">
            <div>正在加载</div>
          </slot>
        </div>
        <slot name="main"></slot>
      </div>
      <slot v-if="infiniteFlag&&!dataFinish&&infiniteFn" name="infinite">
        <div class="infinite">
          正在加载
        </div>
      </slot>
      <slot name="dataFinish" v-if="dataFinish">
        <div class="infinite-data-finish">所有数据加载完毕</div>
      </slot>
    </div>
    <div class="gd-footer">
      <slot name="footer" class="gd-footer"></slot>
    </div>
  </div>
</template>
<script>
  export default{
    data(){
      return {
        initStyle: {},
        scrollCash: 0,
        infiniteFlag: false,
        infiniteEnd: true,
        dropFlag: -1, // 0 down,1 up, 2 loading
        startY: 0,
        disY: 0,
        translate: 0,
        dropped: false
      }
    },
    props: {
      infiniteFn: {
        type: Function
      },
      dataFinish: {
        type: Boolean,
        default: false
      },
      dropFn: {
        type: Function
      }
    },
    created(){
      this.initStyle.height = document.documentElement.clientHeight + 'px'
      this.initStyle.width = document.documentElement.clientWidth + 'px'
    },
    mounted(){
      if (this.dropFn) {
        this.$refs.scrollWrap.addEventListener('touchstart', this.dropStart)
        this.$refs.scrollWrap.addEventListener('touchmove', this.dropMove)
        this.$refs.scrollWrap.addEventListener('touchend', this.dropEnd)
      }
    },
    computed: {
      translateStyle(){
        if (this.translate > 0) {
          return {'transform': 'translate3d(0, ' + this.translate + 'px, 0)'}
        } else {
          return {}
        }
      }
    },
    methods: {
      onScroll(e){
        this.bindInfinite(e)
      },
      bindInfinite(e){
        if (this.dataFinish || !this.infiniteFn) return
        let target = e.target
        let children = target.querySelector('.gd-scroll-wrap')
        if (target.scrollTop >= (children.offsetHeight - target.offsetHeight)) {
          (this.infiniteEnd && this.infiniteFn) && this.onInfinite()
          this.infiniteFlag = true
        } else {
          this.infiniteFlag = false
        }
      },
      dropStart(e){
        this.startY = e.touches[0].clientY
        this.startOffsetTop = this.$refs._main.offsetTop
      },
      dropMove(e){
        if (this.dropFlag === 2) return
        this.dropped = false
        this.disY = e.touches[0].clientY - this.startY
        let dis = this.disY - this.startOffsetTop
        if (dis > 0) e.preventDefault()
        dis = Math.pow(dis, 0.8)
        dis = dis > 80 ? 80 : dis
        let main = this.$refs._main
        if (main.scrollTop === 0) {
          this.translate = dis
          if (dis <= 50) {
            this.dropFlag = 0
          } else {
            this.dropFlag = 1
          }
        }
      },
      async dropEnd(){
        if (this.dropFlag === 2) return
        this.dropped = true
        if (this.dropFlag === 0) {
          this.translate = 0
        } else if (this.dropFlag === 1) {
          this.dropFlag = 2
          this.dropFn && await this.dropFn()
          this.translate = 0
          setTimeout(() => {
            this.dropFlag = -1
          }, 300)
        }
      },
      async onInfinite(){
        this.infiniteEnd = false
        await this.infiniteFn()
        this.infiniteEnd = true
      }
    },
    activated(){
      this.$refs._main.scrollTop = this.scrollCash
    },
    deactivated(){
      this.scrollCash = this.$refs._main.scrollTop
    }
  }
</script>
<style scoped>
  .gd-page {
    display: flex;
    flex-direction: column;
  }

  .gd-main {
    flex: 1;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    position: relative;
  }

  .infinite {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .infinite-data-finish {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 30px;
  }

  .load-wrap {
    margin-top: -50px;
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .gd-scroll-wrap {
    background: #ffffff;
    min-height: 100%;
  }

  .hasDrop {
    margin-top: -50px;
  }

  .isDropped {
    transition: 0.2s;
  }
</style>
