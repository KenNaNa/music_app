<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
        <!-- 这里会被父组件的slider所替换 -->
      </slot>
    </div>
    <div class="dots">
      <span class="dot" :class="{active: currentPageIndex === index }" v-for="(item, index) in dots"></span>
    </div>
  </div>
</template>

<script type="text/javascript">
import BetterScroll from 'better-scroll';
import {addClass} from '../../common/js/dom';
	export default{
		name: 'slider',
		data(){
			return{
        dots: [],
        currentPageIndex: 0
			}
		},
    // 父组件传递过来的属性
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoplay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 2000
      }
    },

    // 操作dom设置sliderGroup的宽度
    mounted(){
      // 这里我们使用异步操作的方式去设置宽度
      setTimeout(()=>{
        // 设置宽度
        this._setSliderWidth(false);
        // 初始化小圆点
        this._initDots();
        // 初始化是slider
        this._initSlider();
        // 初始化自动轮播
        if(this.autoplay){
          this._play();
        }

        // 监听窗口的大小的变化，slider重新刷新以及重新计算宽度
        window.addEventListener("resize",()=>{
          if(!this.slider){
            return ;//如果this.slider不存在，则什么都不做
          }
          this._setSliderWidth(true);
          this.slider.refresh();
        });
      },20);
    },

    // 方法
    methods:{
      _setSliderWidth(isResize){
        // 我们要通过ref这个属性获取子元素，以及本身的宽度
        this.sliderGroupChildren = this.$refs.sliderGroup.children;
        let width = 0;//设置总的宽度
        // 获取父级元素的宽度
        let sliderClientWidth = this.$refs.slider.clientWidth;
        // 获取子元素的个数
        let len = this.sliderGroupChildren.length;
        for(let i=0; i<len; i++){
          let child = this.sliderGroupChildren[i];
          // 设置类名
          addClass(child,"slider-item");
          // 设置宽度
          child.style.width = sliderClientWidth + 'px';
          // 总的宽度增加
          width += sliderClientWidth;
        }

        if(this.loop && !isResize){//若果是无缝轮播
          width += sliderClientWidth * 2;//因为这里是循环轮播需要再加上两个宽度
        }

        // 设置总的宽度
        this.$refs.sliderGroup.style.width = width + 'px';

      },
      _initSlider(){

        this.slider = new BetterScroll(this.$refs.slider,{
          scrollX: true,//设置横向滚动
          scrollY: false,//禁止纵向滚动
          momentum: false,//当快速滑动时是否开启滑动惯性
          snap: { // 为slider组件使用
            loop: this.loop, // 是否无缝循环轮播
            threshold: 0.3, // 用手指滑动时页面可切换的阀值，大于这个阀值时可以滑动到下一页
            speed: 400 // 轮播图切换的动画时间
          },
          bounce: true,
          stopPropagation: true,//阻止默认行为
          click: true//点击a链接时，触发
        })
        console.log(this.slider)
        // 检测滚动结束后，获取当前页的标号
        this.slider.on('scrollEnd',()=>{
          let pageIndex = this.slider.getCurrentPage().pageX;
          // 再把pageIndex的值付给当前页
          // 这一步要放在if判断之前
          this.currentPageIndex = pageIndex;

          // console.log(pageIndex);
          // 判断是否无缝滚动
          if(this.loop){
            pageIndex -= 1;
          }

          // 自动轮播
          if(this.autoplay){
            clearTimeout(this.timer);
            this._play();
          }
        })

        // 接下来实现自动轮播
        // 在进行下一次滚动时，清除上一次的动画
        this.slider.on('beforeScrollStart', () => {
          if (this.autoPlay) {
            clearTimeout(this.timer)
          }
        })
      },

      // 初始化小圆点 
      _initDots(){
        this.dots = new Array(this.sliderGroupChildren.length);
      },

      // 播放
      _play(){
        // 将当前页号加1
        let pageIndex = this.currentPageIndex;
        // 每次都判断是否循环播放
        // 并且加1操作
        if(this.loop){
          pageIndex += 1;
          // 判断是否滚动到最后一页时
          // 返回第一页
          if(pageIndex>=5){
            pageIndex = 0;
          }
        }

        this.timer = setTimeout(()=>{
          // 跳到下一页,goToPage有四个参数 x,y,time,easing
          // x表示横向页数
          // y表示纵向页数
          // time表示延时的时间
          // easing表示动画效果
          this.slider.goToPage(pageIndex,0,400,{});
        },this.interval);
      }
    }
	}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      top: 90%
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>