// 导入播放模式
import {playMode} from '../common/js/config';
import {loadSearch, loadPlay} from '../common/js/cache';
// 现在传递是singer
const state = {
	singer: {},
	playing: false,//播放
	fullScreen: false,//全屏
	playlist: [],//播放列表
	sequenceList: [],//
	mode: playMode.sequence,
	currentIndex: -1,//当前索引
	disc: {},
	topList: {},
	searchHistory: loadSearch(),
	playHistory: loadPlay(),
	favoriteList: []
}

export default state
    