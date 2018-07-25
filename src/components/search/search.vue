<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
  	<div class="shortcut-wrapper" v-show='!query' ref="shortcutWrapper">
  		<scroll class="shortcut" :data="shortcut" ref="shortcut">
        <div >
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li @click="addQuery(item.k)" class="item" v-for="item in hotKey">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div> 
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list @select="addQuery" :searches="searchHistory" @delete="deleteSearchHistory"></search-list>
          </div> 
        </div>    
      </scroll>
  	</div>
    <div class="search-result" v-show='query' ref="searchResult">
      <suggest :query="query" @listScroll='blurInput' @select="saveSearch" ref="suggest">
        
      </suggest>
    </div>
    <comfirm ref="comfirm" :text='text' :confirmBtnText="confirmBtnText" :cancelBtnText="cancelBtnText" @confirm="deleteAll"></comfirm>
    <router-view></router-view>
  </div>
</template>

<script type="text/javascript">
import Scroll from '../../base/scroll/scroll'
import SearchBox from '../../base/search-box/search-box'
import SearchList from '../../base/search-list/search-list'
import {getHotKey} from '../../api/search'
import {ERR_OK} from '../../common/js/config'
import Suggest from '../../components/suggest/suggest'
import Comfirm from '../../base/comfirm/comfirm'
import {mapMutations, mapActions, mapGetters} from 'vuex'
import {playlistMixin} from '../../store/mixin'
	export default{
    mixins: [playlistMixin],
		name: 'search',
		data(){
			return {
				hotKey: [],
        query: '',
        text: '是否清空所有搜索记录',
        confirmBtnText: '确定',
        cancelBtnText: '取消',
			}
		},
		components: {
			Scroll,
			SearchBox,
      Suggest,
      SearchList,
      Comfirm
		},
    computed: {
      shortcut(){
        // 传值监听hotkey改变时
        // 监听searchHistory变化时
        // 重新计算
        return this.hotKey.concat(this.searchHistory);
      },
      // 获取搜索历史
      ...mapGetters([
        'searchHistory'
      ]),
    },
    watch:{
      query(newQuery){
        if(!newQuery){
          setTimeout(()=>{
            this.$refs.shortcut.refresh();
          },20);
        }
      }
    },
		methods: {
      handlerPlaylist(playlist){
        // 判端playlist的长度
        const bottom = playlist.length > 0 ? '+0px' : '';
        this.$refs.shortcutWrapper.style.bottom = bottom;
        this.$refs.searchResult.style.bottom = bottom;
        this.$refs.shortcut.refresh(); 
        this.$refs.suggest.refresh();
      },
      // 控制弹窗的显示与隐藏
      showConfirm(){
        this.$refs.comfirm.show();
      },
      // 设置我们的搜索历史到本地缓存当中
      ...mapActions([
        'saveSearchHistory',
        'deleteSearchHistory',
        'clearSearchHistory'
      ]),
      // 删除所有
      deleteAll(){
        this.clearSearchHistory();
      },
      saveSearch(){
        // 保存搜索记录
        this.saveSearchHistory(this.query);
      },
      blurInput(){
        // 当列表滚动时
        // 输入框失去焦点
        this.$refs.searchBox.blur();
      },
			onQueryChange(query){
        // 当我们的搜索词变化时
        // 设置当前搜索词
        this.query = query;
      },
			addQuery(query){
        // 通过引用ref=searchBox
        this.$refs.searchBox.setQuery(query);
      },
			_getHotKey(){
				getHotKey().then(res=>{
					if(res.code===ERR_OK){
            // 窃取前10个hotkey
						this.hotKey = res.data.hotkey.slice(0,10);
					}
				})
			}
		},
		created(){
			this._getHotKey();
		}

	}
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>