import {mapGetters, mapMutations, mapActions} from 'vuex';
import {playMode} from '../common/js/config'
import {shuffle} from '../common/js/util'
export const playlistMixin = {
	computed:{
		...mapGetters([
			'playlist',
		])
	},
	mounted(){
		this.handlerPlaylist(this.playlist);
	},
	activated(){
		this.handlerPlaylist(this.playlist);
	},
	methods: {
		handlerPlaylist(val){
			throw new Error('component must implement handlePlaylist method')
		}
	},
	watch: {
		playlist(newVal){
			this.handlerPlaylist(newVal)
		}
	}
}


export const playerMixin = {
	computed: {
		iconMode(){
        	// 顺序，随机，循环
        	return this.mode === playMode.sequence ? 'icon-sequence' : (this.mode === playMode.loop ? 'icon-loop' : 'icon-random');
      	},
      	...mapGetters([
	      'sequenceList',
	      'playlist',
	      'currentSong',
	      'mode',
	      'favoriteList'
	    ])
	},
	methods: {
		...mapActions([
	      'saveFavoriteList',
	      'deleteFavoriteList'
	    ]),
		toggleFavorite(song) {
      // 判断当前这首歌是否
      // 是我喜欢的
      // 如果是则删除
      // 否则就保存
	      if (this.isFavorite(song)) {
	        this.deleteFavoriteList(song)
	      } else {
	        this.saveFavoriteList(song)
	      }
	    },
	    getFavoriteIcon(song) {
        // 判断是否为我喜欢的歌曲
        // 是则返回爱心小图标
        // 否则返回不是
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
      ...mapMutations({
      	// 导入mutations 
        setFullScreen: "SET_FULL_SCREEN",
        setPlayingState: "SET_PLAYING_STATE",
        setCurrentIndex: "SET_CURRENT_INDEX",
        setPlayMode: "SET_PLAY_MODE",
        setSequenceList: "SET_SEQUENCE_LIST"
      })
	}
}

export const searchMixin = {
  data() {
    return {
      query: '',
      refreshDelay: 120
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    onQueryChange(query) {
      this.query = query
    },
    blurInput() {
      this.$refs.searchBox.blur()
    },
    addQuery(query) {
      this.$refs.searchBox.setQuery(query)
    },
    saveSearch() {
      this.saveSearchHistory(this.query)
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ])
  }
}
