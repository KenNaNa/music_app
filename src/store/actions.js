import * as types from './mutations-types';
import {playMode} from '../common/js/config';
import {shuffle} from '../common/js/util';
import {saveSearch, deleteSearch, clearSearch, savePlay, saveFavorite, deleteFavorite} from '../common/js/cache';

function findIndex(list,song){
	let index = list.findIndex((item)=>{
		return item.id === song.id;
	})

	return index;
}
// 这里是封装一个mutations
// 当我们点击播放时会提交一系列的mutations
// 所以我们要把把这些mutations封装在一个actions里面
// 这样就会便于操作了
export const selectPlay = function ({commit, state},{list, index}){
	commit(types.SET_SEQUENCE_LIST, list);
	// 我们要在这里判断当前是随机播放时
	// 我们应该选中也能播放这首歌
	if(state.mode === playMode.random){
		// 进行洗牌
		let randomList = shuffle(list);
		commit(types.SET_PLAYLIST, randomList);
		// 找到点击的那首歌的index
		index = findIndex(randomList, list[index]);
	}else{
		commit(types.SET_PLAYLIST, list);
	}
	
	commit(types.SET_CURRENT_INDEX, index);
	commit(types.SET_FULL_SCREEN, true);
	commit(types.SET_PLAYING_STATE, true);
}

// 操作随机播放从第一首歌曲开始播放
// 我们要洗牌播放列表
export const randomPlay = function({commit}, {list}){
	// 设置播放模式为随机模式
	commit(types.SET_PLAY_MODE, playMode.random);
	// 顺序播放列表
	commit(types.SET_SEQUENCE_LIST, list);
	// 洗牌
	let randomList = shuffle(list);
	commit(types.SET_PLAYLIST, randomList);
	// 从头开始播放
	commit(types.SET_CURRENT_INDEX, 0);
	commit(types.SET_FULL_SCREEN, true);
	commit(types.SET_PLAYING_STATE, true);
}

// 点击插入歌曲
export function insertSong({commit, state}, song){
	let playlist = state.playlist.slice();
	let sequenceList = state.sequenceList.slice();
	let currentIndex = state.currentIndex;
	 //记录当前歌曲
	let currentSong = playlist[currentIndex];
	 //查找当前插进去的给的索引在不在playlist
	 //在插入歌曲之前要检索这首歌是否存在
	let fpIndex = findIndex(playlist,song);
	// 因为是插入歌曲
	// 索引加1
	currentIndex ++;
	 //在当前位置插入
	playlist.splice(currentIndex,0,song); 

	// 如果已经包含这首歌曲
	// 先插入歌曲
	// 再删除存在的歌曲
	if(fpIndex>-1){
		// 如果当前的索引大于列表中的索引
		// 就删除一个索引
		if(currentIndex>fpIndex){
			playlist.splice(fpIndex, 1);
			currentIndex--;
		}else{
			playlist.splice(fpIndex+1, 1);
		}
	}


	// 处理sequenceList
	let currentSIndex = findIndex(sequenceList, currentSong) + 1;
	let fsIndex = findIndex(sequenceList, song);
	sequenceList.splice(currentSIndex,0,song);
	if(fsIndex>-1){
		if(currentSIndex>fsIndex){
			sequenceList.splice(fsIndex,1);
		}else{
			sequenceList.splice(fsIndex+1,1);
		}
	}
	// 处理完成后
	// 提交到mutations
	commit(types.SET_PLAYLIST,playlist);
	commit(types.SET_SEQUENCE_LIST, sequenceList);
	commit(types.SET_CURRENT_INDEX, currentIndex);
	commit(types.SET_FULL_SCREEN, true);
	commit(types.SET_PLAYING_STATE, true);
}

// 封装永久缓存
export function saveSearchHistory({commit, state},query){
	commit(types.SET_SEARCH_HISTORY, saveSearch(query));
}

// 封装删除缓存
export function deleteSearchHistory({commit, state}, query){
	commit(types.SET_SEARCH_HISTORY, deleteSearch(query));
}

// 清除本地缓存
export function clearSearchHistory({commit, state}){
	commit(types.SET_SEARCH_HISTORY, clearSearch());
}

// 删除歌曲
export function deleteSong({commit, state}, song){
	let playlist = state.playlist.slice();
	let sequenceList = state.sequenceList.slice();
	let currentIndex = state.currentIndex;
	let pIndex = findIndex(playlist, song);
	playlist.splice(pIndex, 1);
	let sIndex = findIndex(sequenceList, song);
	sequenceList.splice(sIndex, 1);

	if(currentIndex>pIndex || currentIndex === playlist.length-1){
		currentIndex--;
	}

	commit(types.SET_PLAYLIST, playlist);
	commit(types.SET_SEQUENCE_LIST, sequenceList);
	commit(types.SET_CURRENT_INDEX, currentIndex);
	if(!playlist.length){
		commit(types.SET_PLAYING_STATE, false);
	}else{
		commit(types.SET_PLAYING_STATE, true);
	}
}

// 清除所有歌曲
export function deleteSongList({commit}){
	commit(types.SET_PLAYLIST,[]);
	commit(types.SET_SEQUENCE_LIST, []);
	commit(types.SET_CURRENT_INDEX, -1);
	commit(types.SET_PLAYING_STATE, false);
}

export const savePlayHistory = function ({commit}, song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song))
}

export const saveFavoriteList = function ({commit}, song) {
  commit(types.SET_FAVORITE_LIST, saveFavorite(song))
}

export const deleteFavoriteList = function ({commit}, song) {
  commit(types.SET_FAVORITE_LIST, deleteFavorite(song))
}