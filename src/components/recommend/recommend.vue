
<template>
  <div class="recommend" ref="recommend">
    <keep-alive>
      <scroll ref="scroll" class="recommend-content" :data='discList'>
        <div>
          <div v-if="recommends.length" class="slider-wrapper" ref="sliderWrapper">
            <slider>
              <div v-for="item in recommends">
                <a :href="item.linkUrl">
                  <!-- needsclick解决与fastclick的点击冲突的属性 -->
                  <img class="needsclick" :src="item.picUrl">
                </a>
              </div>
            </slider>
          </div>
          <div class="recommend-list">
            <h1 class="list-title">热门歌单推荐</h1>
            <ul>
              <li @click="selectItem(item)" v-for="item in discList" class="item">
                <div class="icon">
                  <img width="60" height="60" v-lazy="item.imgurl" @load="loadImage">
                </div>
                <div class="text">
                  <h2 class="name" v-html="item.creator.name"></h2>
                  <p class="desc" v-html="item.dissname"></p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="loading-container" v-show="!discList.length">
          <loading></loading>
        </div>
      </scroll>
    </keep-alive>
    <router-view></router-view>
  </div>
</template>

<script type="text/javascript">
import Slider from '../../base/slider/slider';
import Scroll from '../../base/scroll/scroll';
import Loading from '../../base/loading/loading'
import {getRecommend,getDisclist} from '../../api/recommend';

import {ERR_OK} from '../../common/js/config';
import playlistMixin from '../../api/mixin';
import {mapMutations} from 'vuex';
	export default{
		name: 'recommend',
    mixins: [playlistMixin],
		data(){
			return {
        recommends: [],
        discList: []
			}
		},
		created(){
      this._getRecommend();
      this._getDisclist();
		},

		methods:{
      ...mapMutations({
        setDisc: 'SET_DISC'
      }),
      // 点击跳转歌单详情
      selectItem(item){
        console.log(item);
        this.$router.push({
          path: `/recommend/${item.dissid}`
        });

        this.setDisc(item);
      },
      // 实现 mixin里面的handlerPlaylist
      handlerPlaylist(list){
         const bottom = list.length>0 ? '60px' : '';
         this.$refs.recommend.style.bottom = bottom;
         this.$refs.scroll.refresh(); 
      },
			_getRecommend(){
				getRecommend().then((res)=>{
					if(res.code===ERR_OK){
            console.log(res)
            this.recommends = res.data.slider;
            console.log(this.recommends);
					}
				})
			},
      _getDisclist(){
        getDisclist().then((res)=>{
          if(res.code===ERR_OK){
              this.discList = res.data.list;
          }
        })
      },
      // 检测一张图片的加载，之后刷新scroll组件
      loadImage(){
        // 为了确保只有一次执行
        if(!this.checkScroll){
          this.$refs.scroll.refresh();
          this.checkScroll = true;
        }
      }
		},

    components: {
      Slider,
      Scroll,
      Loading
    }

	}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          width:  100%
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>