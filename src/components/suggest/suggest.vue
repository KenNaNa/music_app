<template>
  <scroll class='suggest' 
  						:data="results" 
  						:pullup="pullup" 
  						:beforeScroll='beforeScroll'
  						@scrollToEnd="searchMore" 
  						ref='suggest' 
  						@beforeScroll="listScroll">
    <ul class="suggest-list">
      <li  class="suggest-item" v-for="item in results" @click='selectItem(item)'>
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading  title="" v-show="hasMore"></loading>
    </ul>
    <div class="no-result-wrapper" v-show="!hasMore && !results.length">
    	<no-result :title='title'> </no-result>
    </div>
  </scroll>
</template>

<script type="text/javascript">
	import Loading from '../../base/loading/loading'
	import Scroll from '../../base/scroll/scroll'
	import {search} from '../../api/search'
	import {ERR_OK} from '../../common/js/config'
	import {filterSinger} from '../../api/song'
	import {createSong} from '../../api/song' 
	import {Singer} from '../../common/js/singer'
	import {mapMutations, mapActions} from 'vuex'
	import noResult from '../../base/no-result/no-result'

	const TYPE_SINGER = 'singer'
	export default {
		name: 'suggest',
		computed: {
			title(){
				return '抱歉，暂无搜索结果'
			}
		},
		props: {
			// suggest依赖于query
			query: {
				type: String,
				default: ''
			},
			showSinger: {
				type: Boolean,
				default: true
			},

		},
		data(){
			return {
				page: 1,
				perpage: 20,
				results: [],
				pullup: true,//是否支持下拉刷新
				hasMore: true,//标志位表示加载完成
				beforeScroll: true,
			}
		},
		components: {
			Loading,
			Scroll,
			noResult
		},
		methods: {
			refresh(){
				this.$refs.suggest.refresh();
			},
			listScroll(){
				// 派发事件
				this.$emit('listScroll');
			},
			// 下拉加载
			searchMore(){
				console.log('searchMore')
				if(!this.hasMore){
					return ;
				}
				// 就把page加1
				this.page++;
				search(this.query,this.page,this.showSinger,this.perpage).then(res=>{
					if(res.code===ERR_OK){
						// 将上次的results与下拉刷新的值concat起来
						this.results = this.results.concat(this._getResult(res.data));
						// 在这个时候去检查是否
						this._checkMore(res.data);
					}
				})
			},
			...mapMutations({
		       setSinger: 'SET_SINGER'
		    }),
		    ...mapActions([
		    	'insertSong'
		    ]),
			// 点击跳转
			selectItem(item){
				// console.log(item)
				// 歌手的点击
				if(item.type === TYPE_SINGER){
					console.log(1)
					const singer = new Singer({
						id: item.singermid,
						name: item.singername,
					})

					this.$router.push({
						path: `/search/${singer.id}`
					})
					console.log('singer',singer);
					this.setSinger(singer);
				}else{
					// 歌曲的点击
					// 插入歌曲
					this.insertSong(item);
				}

				// 派发一个事件
				this.$emit('select');
			},
			// 获取名字
			getDisplayName(item){
				if(item.type===TYPE_SINGER){
					return item.singername;
				}else{
					return `${item.name}-${item.singer}`
				}
			},
			// 获取icon图标
			getIconCls(item){
				if(item.type === TYPE_SINGER){
					// 获取歌手名字
					return 'icon-mine';
				}else{
					// 获取歌曲的名字
					return 'icon-music';
				}
			},
			_checkMore(data){
				const song = data.song;
				// 判断list没有的时候或者
				if(!song.list.length || ((song.curnum + song.curpage * this.perpage)>song.totalnum)){
					this.hasMore = false;
				}
			},
			search(){
				// 每次请求时，我们应该从1开始
				this.page = 1;
				this.hasMore = true;
				// 将组建滚动到顶部
				this.$refs.suggest.scrollTo(0,0);
				// 请求服务端，请求检索词
				search(this.query, this.page, this.showSinger, this.perpage).then(res=>{
					if(res.code===ERR_OK){
						this.results = this._getResult(res.data)
						console.log('search',this.results)
						// 在这个时候去检查是否
						this._checkMore(res.data);
					}
				})
			},
			_getResult(data){
				let ret = [];
				// 判断是否存在zhida和singerid
				// 就获取zhida的东西
				if(data.zhida && data.zhida.singerid){
					ret.push({
						...data.zhida,
						...{type:TYPE_SINGER}
					})
				}
				// 判断song是否存在
				if(data.song){
					ret = ret.concat(this._normalizeSongs(data.song.list));
				}

				return ret;
			},
			_normalizeSongs(list) {
		        let ret = []
		        list.forEach((musicData) => {
		          if (musicData.songid && musicData.albummid) {
		            ret.push(createSong(musicData))
		          }
		        })
		        return ret
		    },
		},
		watch: {
			// 监听query发生变化时，向服务端请求数据
			// 进行搜索
			query(newQuery){
				this.search();
			}
		}
	}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>