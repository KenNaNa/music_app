// 定义修改singer的操作
import * as types from './mutations-types'
const mutations = {
	// 类型函数处理传入两个参数，一个是状态，另一个是singer对象
	[types.SET_SINGER](state, singer) {
	    state.singer = singer
	},
	[types.SET_PLAYING_STATE](state, flag){
		state.playing = flag
	},
	[types.SET_FULL_SCREEN](state, flag){
		state.fullScreen = flag
	},
	[types.SET_PLAYLIST](state, list){
		state.playlist = list
	},
	[types.SET_SEQUENCE_LIST](state, list){
		state.sequenceList = list
	},
	[types.SET_PLAY_MODE](state, mode){
		state.mode = mode
	},
	[types.SET_CURRENT_INDEX](state, currentIndex){
		state.currentIndex = currentIndex
	},
	[types.SET_DISC](state, disc){
		state.disc = disc
	},
	[types.SET_TOP_LIST](state, topList){
		state.topList = topList
	},
	[types.SET_SEARCH_HISTORY](state, searchHistory){
		state.searchHistory = searchHistory;
	},
	[types.SET_PLAY_HISTORY](state, playHistory){
		state.playHistory = playHistory;
	},
	[types.SET_FAVORITE_LIST](state, favoriteList){
		state.favoriteList = favoriteList
	}
}

export default mutations