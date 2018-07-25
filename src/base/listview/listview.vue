<template>
  <scroll class="listview"  @scroll='scroll' 
                            :data='data' 
                            :listen-scroll="listenScroll" 
                            :probe-type="probeType"
                            
                            ref="listview">
    <!-- 歌手列表 -->
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <uL>
          <li @click="selectItem(item)" v-for="item in group.items" class="list-group-item">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </uL>
      </li>
    </ul>
    <!-- 右侧快速口 -->
    <div class="list-shortcut" @touchstart.stop.prevent="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove"
         @touchend.stop>
      <ul>
        <li v-for="(item, index) in shortcutList" :data-index="index" class="item"
            :class="{'current':currentIndex===index}">{{item}}
        </li>
      </ul>
    </div>
    <!-- 固定导航栏 -->
    <div class="list-fixed" ref="fixed" v-show="fixedTitle">
      <div class="fixed-title">{{fixedTitle}} </div>
    </div>
    <!-- 添加loading组件 -->
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>  
</template>

<script type="text/ecmascript-6">
import Scroll from '../../base/scroll/scroll';
import Loading from '../../base/loading/loading';
import {getData} from '../../common/js/dom';
  // 标题的高度
  const TITLE_HEIGHT = 30
  // 锚点连接的高度
  const ANCHOR_HEIGHT = 18

  export default {
    name: 'listview',
    data(){
      return {
        scrollY: -1,//检测滚动的Y轴坐标
        currentIndex: 0,//检测高亮的index
        diff: -1,//fixedTitle的差值
      }
    },
    props: {
      data: {
        type: Array,
        default: []
      },

    },
    components: {
      Scroll,
      Loading
    },
    created(){
      // 在dom加载之后给this添加一个对象用于存储
      // 触摸是的位置，以及拖动的位置
      this.touch = {};
      // 监听滚动
      this.listenScroll = true;
      // 高度
      this.listHeight = [];
      // 实时监听
      this.probeType = 3;
    },
    computed: {
      shortcutList(){
        return this.data.map((group)=>{
          // 返回标题的第一个字母
          console.log(group.title.substring(0,1));
          return group.title.substring(0,1);
        })
      },
      fixedTitle(){
        // 如果scroll组件往下拉的时候，我们应该让这个导航栏不出现
        // 
        if(this.scrollY>0){
          return '';
        }
        // this.data是指父组件传递过来的data,就是singer组件的singers数据
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : '';
      }
    },
    methods: {
      refresh(){
        this.$refs.listview.refresh();
      },
      // 当歌手列表时，派发事件
      selectItem(item){
        // 通知 外部自己被点击了
        this.$emit('select',item);
      },
      // 滚动到第几个标题的区域
      onShortcutTouchStart(e){
        // 获取当前点击的元素索引
        // 然后跳到此元素对应的区域
        let target = e.target;
        let anchorIndex = getData(target,'index');
        // 就要记录鼠标一开始触摸的位置
        let startTouch = e.touches[0];
        this.touch.startY = startTouch.pageY;
        // 记录一开始点击的元素的索引
        this.touch.anchorIndex = anchorIndex

        this._scrollTo(anchorIndex);
        
        console.log(e);
      },
      // 当鼠标拖动的时候
      onShortcutTouchMove(e){
        let moveTouch = e.touches[0];
        // 获取鼠标拖动到那个元素上
        this.touch.endY = moveTouch.pageY;
        // 获得y轴的坐标差值
        let _mY = this.touch.endY - this.touch.startY;
        // 根据差值算出当前的元素的索引
        this.touch.anchorIndex = parseInt(this.touch.anchorIndex) + Math.floor(_mY / ANCHOR_HEIGHT);
        let anchorIndex = this.touch.anchorIndex;
        this._scrollTo(anchorIndex);
      },
      // 这个是scroll组件传递过来的函数
      scroll(pos){
        this.scrollY = pos.y
        console.log('这是listview的scroll函数');
      },

      // 计算高度
      _calculateHeight(){
        // 计算出每个listGroup的高度
        this.listHeight = [];
        // 获取listGroup元素
        let list = this.$refs.listGroup;
        let height = 0;
        this.listHeight.push(height);
        // 遍历计算高度
        for(let i=0; i<list.length; i++){
          let item = list[i];
          height += item.clientHeight;
          this.listHeight.push(height);
        }
      },
      // 封装一个函数
      _scrollTo(anchorIndex){
        // 处理鼠标点击最后一个和点击第一个
        // 处理鼠标拖动到顶部和拖动到底部
        console.log(anchorIndex);
        if(anchorIndex<0){
          anchorIndex = 0;
        }
        if(anchorIndex>this.$refs.listGroup.length-2){
          anchorIndex = this.$refs.listGroup.length - 2;
        }
        // 监听点击时scrollY改变
        this.scrollY = -this.listHeight[anchorIndex];
        this.$refs.listview.scrollToElement(this.$refs.listGroup[anchorIndex],0);
      },
    },
    // 监视data数据的变化
    watch: {
      data(){
        setTimeout(()=>{
          this._calculateHeight();
        },20)
      },
      scrollY(newY){
        console.log(1);
        // 保留
        const listHeight = this.listHeight;
        console.log('listHeight'+this.listHeight)
        // 落在最上面
        if(newY>0){
          this.currentIndex = 0;
          return ;
        }
        console.log(2);
        // 遍历数据以便知道落在那个区间
        for(let i=0; i<listHeight.length - 1; i++){
          let height1 = listHeight[i];
          let height2 = listHeight[i+1];
          console.log(3);
          // 判断高度如果是在height1和height2之间的话就把currentIndex = i;
          // !height2是因为height2有可能先为undefined
          if(!height2 || ((-newY)>=height1 && (-newY)<height2)){
            this.currentIndex = i;
            console.log("这是滚动的区域："+this.currentIndex);
            return ;
          }
        }
        // 当滚动到底部，且-newY大于最后一个元素的上限
        this.currentIndex = listHeight.length - 2
      },
      // 监听fixedTitle的变化
      diff(newVal){
        // 算出固定导航栏的top值
        console.log("diff"+newval)
        const fixedTop = (newVal>0 && newVal<TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0;
        if(this.fixedTop===fixedTop){
          return ;
        }
        this.fixedTop = fixedTop;
        // 让固定导航栏有个向上定的效果
        this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
      }
    }
  }

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
