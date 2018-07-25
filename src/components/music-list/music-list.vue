<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <!-- 播放按钮 -->
      <div class="play-wrapper">
        <div ref="playBtn" v-show="songs.length>0" class="play" @click="random">
          <i class="icon-play" ></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref='layer'></div>
    <!-- 歌曲列表滚动组件 -->
    <scroll :probeType='probeType' 
            :listenScroll='listenScroll'  
            :data="songs" class="list" ref="list" @scroll="scroll">
      <div class="song-list-wrapper">
        <song-list :songs="songs" @select='selectItem' :rank="rank"></song-list>
      </div>
      <!-- loading -->
      <div v-show="!songs.length" class="loading-container">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>
<script type="text/javascript">
import Scroll from '../../base/scroll/scroll';
import SongList from '../../base/song-list/song-list';
import Loading from '../../base/loading/loading';
import {mapActions} from 'vuex';
import playlistMixin from '../../api/mixin'
const RESERVED_HEIGHT = 40;//定义上面返回的高度固定为40

  export default {
    name: 'musicList',
    mixins: [playlistMixin],
    data(){
      return{
        scrollY: 0,//监听滚动时scrollY的变化
      }
    },
    components: {
      Scroll,
      SongList,
      Loading
    },
    props: {
      bgImage: {
        type: String,
        default: ""
      },
      songs: {
        type: Array,
        default: []
      },
      title: {
        type: String,
        default: ""
      },
      rank: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      // 计算背景图拍
      bgStyle(){
        return `background-image: url(${this.bgImage})`;
      }
    },
    mounted(){
      // 让歌曲列表的高度为背景图的高度
      // 我们要记录一下bgImage的高度
      this.bgImageHeight = this.$refs.bgImage.clientHeight;

      // 还要记录一下bg-layer最小滚动高度
      this.minTranslateY = -this.bgImageHeight + RESERVED_HEIGHT;
      this.$refs.list.$el.style.top = `${this.bgImageHeight}px`;
    },
    created(){
      this.probeType = 3;
      this.listenScroll = true;
    },
    methods: {
      // 实现 mixin里面的handlerPlaylist
      handlerPlaylist(list){
        const bottom = list.length>0 ? '60px' : '';
        this.$refs.list.$el.style.bottom = bottom;
        this.$refs.list.refresh(); 
      },
      scroll(pos){
        // 实时监听滚动并且把当前滚动的值赋予scrollY
        this.scrollY = pos.y;
      },
      back(){
        this.$router.back();
      },
      random(){
        this.randomPlay({
          list: this.songs
        })
      },
      selectItem(item, index){
        this.selectPlay({
          list: this.songs,
          index: index
        })
      },
      ...mapActions([
        'selectPlay',
        'randomPlay'
      ])
    },
    watch: {
      scrollY(newY){
        
        // 要让bg-layer随着scroll组件的滚动而滚动
        // 让最小滚动搞与newY对比
        // 让bg-layer最大滚动到顶部就停止不滚动
        let minTranslateY = this.minTranslateY;
        let zIndex = 0;
        let blur = 0;
        let scale = 1;
        const percent = Math.abs(newY / this.bgImageHeight);
        if(newY > 0){
          // 向下拉的时候，图片跟着放大一点点
          // 此时的层级也要改变
          zIndex = 10;
          scale = 1 + percent;
        }else{
          // 当往上拉时
          // 图片渐渐模糊
          blur = Math.min(20,percent*20);
        }
        console.log('newY: '+newY+' , '+'minTranslateY: '+minTranslateY);
        
        minTranslateY = Math.max(minTranslateY,newY);
        // 设置高斯模糊效果
        this.$refs.filter.style['backdrop-filter'] = `blur(${blur}px)`;
        this.$refs.layer.style['transform'] = `translate3d(0,${minTranslateY}px,0)`;
        this.$refs.layer.style['webkitTransfrom'] = `translate3d(0,${minTranslateY}px,0)`;
        // 接下来我们要判断当newY滚动到小于minTranslateY时的效果
        // 图片的高度发生变化
        // bg-image的padding-top发生变化
        // 图片的层级发生变化
        // 图片盖住文字
        if(newY < minTranslateY){
          zIndex = 10;
          this.$refs.bgImage.style.paddingTop = 0;
          this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`;
          this.$refs.playBtn.style.display = 'none';
        }else{
          this.$refs.bgImage.style.paddingTop = "70%";//因为我们在布局的时候我们使用那个padding-top撑篙的
          this.$refs.bgImage.style.height = `0`;
          this.$refs.playBtn.style.display = 'block';
        }
        this.$refs.bgImage.style.zIndex = zIndex;
        this.$refs.bgImage.style['transform'] = `scale(${scale})`;
      }
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      // overflow: hidden
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>