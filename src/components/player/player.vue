<template>
  <div class="player" v-show="playlist.length>0">
  	<transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <div class="top">
          <div class="back needsclick" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle"
             @touchstart.prevent="middleTouchStart"
             @touchmove.prevent="middleTouchMove"
             @touchend="middleTouchEnd">
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine" class="text" 
                      :class="{'current': currentLineNum === index}"
                      v-for="(line,index) in currentLyric.lines" >{{line.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
            <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click='changeMode'>
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls" >
              <i :class="playIcon" @click="togglePlaying"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i  class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i @click="toggleFavorite(currentSong)" class="icon" :class="getFavoriteIcon(currentSong)"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
  	<transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img  width="40" height="40" :src="currentSong.image" :class="cdCls">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
            <progress-circle :radius="radius" :percent="percent">
              <i class="icon-mini" :class="miniIcon" @click.stop="togglePlaying"></i>
            </progress-circle>
        </div>
        <div class="control" @click.stop="showPlayList">
          <i class="icon-playlist" ></i>
        </div>
      </div>
    </transition>
    <playlist ref="playlist"></playlist>
    <!-- 检测currentSong的变化 -->
    <audio ref="audio" :src="currentSong.url" 
           @play='ready' 
           @error="error" 
           @timeupdate="updateTime" 
           @ended="end"></audio>
  </div>
</template>

<script type="text/javascript">
import Scroll from '../../base/scroll/scroll'
import {mapGetters, mapMutations, mapActions} from 'vuex'
import animations from "create-keyframe-animation"
import progressBar from '../../base/progress-bar/progress-bar'
import progressCircle from '../../base/progress-circle/progress-circle'
import {playMode} from '../../common/js/config'
import {shuffle} from '../../common/js/util'
import Lyric from 'lyric-parser'
import playlist from '../../components/playlist/playlist'
// import {playerMixin} from '../../store/mixin'

	export default {
    // mixins: [playerMixin],
		name: 'player',
		data() {
			return {
        songReady: false,//当歌曲加载完成时，点击下一首或者上一首
        currentTime: 0,//当前播放时间
        radius: 32,
        currentLyric: null,
        currentLineNum: 0,
        playingLyric: '',
        currentShow: 'cd',
        refreshDelay: 120
			}
		},
    created(){
      // DOM加载完成后进行滑动
      this.touch = {};
    },
		computed: {
      // 播放模式
      iconMode(){
        // 顺序，随机，循环
        return this.mode === playMode.sequence ? 'icon-sequence' : (this.mode === playMode.loop ? 'icon-loop' : 'icon-random');
      },
      // 播放图标
      playIcon(){
        return this.playing ? 'icon-pause' : 'icon-play';
      },
      // mini播放
      miniIcon(){
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini';
      },
      // cdCls
      cdCls(){
        return this.playing ? 'play' : 'play pause';
      },
      disableCls() {
        return this.songReady ? '' : 'disable'
      },
      percent() {
        // 设置当前进度的比例
        return this.currentTime / this.currentSong.duration
      },
      // 导入要使用的getters
			...mapGetters([
				'fullScreen',
				'playlist',
        'currentSong',
        "playing",
        "currentIndex",
        'mode',
        'sequenceList',
        'favoriteList'
			])
		},

    methods: {
      ...mapActions([
        'savePlayHistory',
        'saveFavoriteList',
        'deleteFavoriteList'
      ]),
      toggleFavorite(song) {
        if (this.isFavorite(song)) {
          this.deleteFavoriteList(song)
        } else {
          this.saveFavoriteList(song)
        }
      },
      getFavoriteIcon(song) {
        if (this.isFavorite(song)) {
          return 'icon-favorite'
        }
        return 'icon-not-favorite'
      },
      isFavorite(song) {
        const index = this.favoriteList.findIndex((item) => {
          return item.id === song.id
        })
        return index > -1
      },
      // 点击小图标时显示列表
      showPlayList(){
        console.log(1)
        this.$refs.playlist.show();
      },
      // 歌词与cd的切换
      middleTouchStart(e){
        // 记录是否touchstart
        this.touch.initiated = true;
        const touches = e.touches[0];
        this.touch.startX = touches.pageX;
        this.touch.startY = touches.pageY;
      },
      middleTouchMove(e){
        // 如果我们没有touchstart
        // 就什么都不做
        if(!this.touch.initiated){
          return ;
        }
        // 保存touchmove的东西
        const touches = e.touches[0];
        this.touch.endX = touches.pageX;
        this.touch.endY = touches.pageY;
        let deltaX = this.touch.endX - this.touch.startX;
        let deltaY = this.touch.endY - this.touch.startY;
        // 我们要判断如果纵向deltaY的绝对值大于横向deltaX时，我们什么都不做
        if(Math.abs(deltaY)>Math.abs(deltaX)){
          return ;
        }

        // 我们要计算出lef,width
        let left = this.currentShow === 'cd' ? 0 : -window.innerWidth;
        // 是指定滑动的范围
        let width = Math.min(0, Math.max(-window.innerWidth, left + deltaX));
        // 保存比例
        this.touch.percent = Math.abs(width/window.innerWidth);
        // 设置
        this.$refs.lyricList.$el.style['transform'] = `translate3d(${width}px,0,0)`;
        this.$refs.lyricList.$el.style['transtionDuration'] = '0ms';
        this.$refs.middleL.style['opacity'] = 1 - this.touch.percent;
        this.$refs.middleL.style['transtionDuration'] = '0ms';
      },
      middleTouchEnd(e){
        let width;
        let opacity;
        if(this.currentShow === 'cd'){
          // 处理从右边向左滑动
          if(this.touch.percent > 0.1){
            width = -window.innerWidth;
            opacity = 0;
            // 修改currentShow
            this.currentShow = 'lyric';
          }else{
            width = 0;
            opacity = 1;
          }
        }else{
          // 处理从左边向右滑动
          if(this.touch.percent < 0.9){
            width = 0;
            opacity = 1;
            this.currentShow = 'cd';
          }else{
            width = -window.innerWidth;
            opacity = 0;
          }
        }
        this.$refs.lyricList.$el.style['transform'] = `translate3d(${width}px,0,0)`;
        this.$refs.lyricList.$el.style['transtionDuration'] = '300ms';
        this.$refs.middleL.style['opacity'] = opacity;
        this.$refs.middleL.style['transtionDuration'] = '300ms';
      },
      // 歌词播放效果
      handleLyric({lineNum, txt}) {
        this.currentLineNum = lineNum
        if (lineNum > 5) {
          // 当超过5行时，开始向上滚动
          let lineEl = this.$refs.lyricLine[lineNum - 5]
          this.$refs.lyricList.scrollToElement(lineEl, 1000)
        } else {
          // 在5行之内不滚动
          this.$refs.lyricList.scrollTo(0, 0, 1000)
        }
        this.playingLyric = txt
      },
      // 获取歌词
      getLyric(){
        // 防止我们的歌曲不存在时
        // getLyric为undefined的
      
        if(!this.currentSong.getLyric){
          return ;
        }
        this.currentSong.getLyric().then((lyric)=>{
          if(this.currentSong.lyric!=lyric){
            // 判断当前这首歌曲
            // 已经切换到下一首时，
            // 不再使用当前这首歌
          }
          this.currentLyric = new Lyric(lyric, this.handleLyric);
          // 判断当前播放的是哪一行歌词
          if (this.playing) {
            // 当歌曲在在播放的时候
            // 就让歌词也跟着播放
            this.currentLyric.play()
          }
          console.log(this.currentLyric)
        }).catch((err)=>{
        	if(err){
        		this.currentLyric = null;
        		this.playingLyric = '';
        		this.currentLineNum = 0;
        	}
        })
      },
      // 重置currentIndex
      resetCurrentIndex(list){
        // 找到当前的索引
        let index = list.findIndex((item)=>{
          return item.id===this.currentSong.id;
        });
        // 设置
        this.setCurrentIndex(index);
      },
      // 改变播放模式
      changeMode(){
        // 每点击一次加1
        // 然后取余
        const mode = (this.mode + 1) % 3;
        // 通过setPlayMode修改mode
        this.setPlayMode(mode);
        // 洗牌
        let list = null;
        if(mode===playMode.random){
          // 进行洗牌操作
          list = shuffle(this.sequenceList);
        }
      },
      // 监听子组件progress-bar传递过来的percent
      onProgressBarChange(percent){
        // 操作audio的currentTime
        // 改变播放进度
        // 用百分比与当前歌曲的总时间相乘
        // 再赋值给当前的时间
        const currentTime = percent * this.currentSong.duration;
        this.$refs.audio.currentTime = currentTime;
        // 当拖拽到当前位置时 不播放，就播放
        if(!this.playing){
          this.togglePlaying();
        }
        // 判断当我们拖动小球时，我们应该让歌曲滚动到
        // 相应的位置
        if(this.currentLyric){
        	this.currentLyric.seek(currentTime * 1000);
        }
      },
      // 单曲循环播放
      loop(){
        // 将本歌曲的当前播放时间置为0即可
        this.$refs.audio.currentTime = 0;
        // 再一次调用play()
        this.$refs.audio.play();
        // 当循环播放结束时，歌词因该回到开头
        if(this.currentLyric){
        	this.currentLyric.seek(0);
        }
      },
      // 播放结束
      end(){
        // 然后切换到下一首
        // 需要注意的是当单曲循环的话需要判断一下
        if(this.mode===playMode.loop){
          this.loop();//调用单曲循环
        }else{
          this.next();//否则才调用下一首
        }
      },
      // 歌曲播放的当前时间
      updateTime(e){
        // 将audio对象的当前时间付给currentTime
        this.currentTime = e.target.currentTime;
      },
      // 转换成秒
      format(interval){
        interval = interval | 0;
        const minute = this._padZero(interval / 60 | 0); //向下取整
        const second = this._padZero(interval % 60);
        return `${minute}:${second}`; 
      },
      // 补零操作
      _padZero(val){
        if(val<10){
          return '0' + val;
        }
        return val;
      },
      error(){
        this.songReady = true;
      },
      // 加载完成函数标志
      ready(){
        this.songReady = true;
        // 调用
        this.savePlayHistory(this.currentSong);
      },
      // 点击下一首
      next(){
        // 如果ready还没完成就直接返回
        if(!this.songReady){
          return ;
        }
        // 处理一下边界问题
      	// 假设歌曲只有一条时
      	// 就让他单曲循环
      	if(this.playlist.length===1){
      		this.loop();//让他单曲循环就好了
          return;
      	}else{
      		let index = this.currentIndex + 1;
	        if(index === this.playlist.length){
	          index = 0;
	        }
	        this.setCurrentIndex(index);
	        // 改变playing 的状态
	        if(!this.playing){
	          this.togglePlaying();
	        }
      	}
        
        // 点击之后吧songReady置false
        this.songReady = false;
      },
      // 点击上一首
      prev(){
        // 如果ready还没完成就直接返回
        if(!this.songReady){
          return ;
        }
        // 处理一下边界问题
      	// 假设歌曲只有一条时
      	// 就让他单曲循环
        if(this.playlist.length===1){
        	this.loop();
          return;
        }else{
        	let index = this.currentIndex - 1;
	        if(index === -1){
	          index = this.playlist.length - 1;
	        }
	        this.setCurrentIndex(index);
	        // 改变playing 的状态
	        if(!this.playing){
	          this.togglePlaying();
	        }
        }
        
        // 点击之后吧songReady置false
        this.songReady = false;
      },
      // 切换播放
      togglePlaying(){
      	if(!this.songReady){
      		return ;
      	}
        this.setPlayingState(!this.playing);
        // 歌曲与歌词同步
        if(this.currentLyric){
        	this.currentLyric.togglePlay();
        }
      },
      back(){
        // 设置是否全屏
        this.setFullScreen(false);
      },
      open(){
        // 打开全屏
        this.setFullScreen(true);
      },
      ...mapMutations({
        // 导入mutations 
        setFullScreen: "SET_FULL_SCREEN",
        setPlayingState: "SET_PLAYING_STATE",
        setCurrentIndex: "SET_CURRENT_INDEX",
        setPlayMode: "SET_PLAY_MODE",
        setSequenceList: "SET_SEQUENCE_LIST"
      }),
      enter(el,done){
        // 动画进入时的函数
        const {x, y, scale} = this._getPosAndScale();
        // 定义动画
        let animation = {
          0: {
            transform: `translate3d(-${x}px, ${y}px, 0) scale(${scale})`
          },
          60: {
            transform: `translate3d(0, 0, 0) scale(1.1)`
          },
          100: {
            transform: `translate3d(0, 0, 0) scale(1)`
          }
        }

        // 使用create-keyframe-animation的API
        // 注册动画
        animations.registerAnimation({
          name: 'move',
          animation,
          presets: {
            duration: 400,
            easing: 'ease'
          }
        })

        // 启动动画
        // move 动画
        // done是回调函数
        animations.runAnimation(this.$refs.cdWrapper, 'move', done);
    },
    afterEnter(){
      // 动画完成时，去除动画
      animations.unregisterAnimation('move')
      this.$refs.cdWrapper.style.animation = ''
    },
    leave(el,done){
      this.$refs.cdWrapper.style.transition = "all 0.4s";
      const {x, y, scale} = this._getPosAndScale();
      this.$refs.cdWrapper.style.transform = `translate3d(-${x}px, ${y}px, 0) scale(${scale})`;
      this.$refs.cdWrapper.addEventListener('transitionend', done)
    },
    afterLeave(){
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style["transform"] = ''
    },
    _getPosAndScale(){
        // 目标宽度
        const targetWidth = 40;
        // 目标距离左边
        const paddingLeft = 40;
        // 目标距离底部
        const paddingBottom = 30;
        // 目标距离顶部
        const paddingTop = 80;
        // 大cd的width
        const width = window.innerWidth * 0.8;
        // 初始缩放比例
        const scale = targetWidth / width;
        // 初始的x坐标(中心)
        const x = (window.innerWidth / 2 - paddingLeft);
        // 初始的y坐标(中心)
        const y = (window.innerHeight - paddingTop - width / 2 - paddingBottom); 

        return {
          x,
          y,
          scale
        }
      },
    },
    components: {
      Scroll,
      progressBar,
      progressCircle,
      playlist
    },
    
    watch: {
      currentSong(newSong, oldSong){
        // 这里的newSong 可能是个空的对象
        // 为什么呢
        // 因为当我们歌曲全部删除时 
        // 再切换到下一首时，就是空了
        if(!newSong){
          return ;
        }
        // 注意我们在播放时 不能同时请求路径，所以用到nextTick()进行延时
        // 判断当newSong.id===oldSong.id时，什么都不做
        if(newSong.id===oldSong.id){
          return ;
        }
        // 当我们在切换歌曲时，会有歌曲闪动的bug
        // 是因为我们每播放一首歌就会去new一个Lyric类
        // 而歌词滚动是有定时器的，因为在每次播放下一首时，上一次的定时器还在
        // 所以才会有这个现象
        // 所以我们要监听歌曲变化时，把上一次的定时器情调
        if(this.currentLyric){
        	this.currentLyric.stop();
          this.currentTime = 0;
          this.playingLyric = '';
          this.currentLineNum = 0;
        }
        var that = this;
        if(this.timer){
          clearTimeout(this.timer);
        }
        this.timer=/*this.$nextTick*/setTimeout(() => {
          that.$refs.audio.play();
          // 获取歌词
          that.getLyric()
        },1000);
      },
      playing(newPlaying){
        const audio = this.$refs.audio; 
        console.log(audio)
        // 跟上面一样
        this.$nextTick(()=>{
          newPlaying ? audio.play() : audio.pause();
        })
      }
    },
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
              margin-right: 10px
            &.time-r
              text-align: right
              margin-left: 10px
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 300
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0px
          top: 0px

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>