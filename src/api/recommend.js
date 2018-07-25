import jsonp from '../common/js/jsonp';
import {commonParams,callback,playListParams} from '../common/js/config';
import axios from 'axios';
// 获取轮播图数据
export function getRecommend(){
	// 获取地址
	const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

	  const data = Object.assign({}, commonParams, {
	    platform: 'h5',
	    uin: 0,
	    needNewCode: 1
	  })

	  return jsonp(url, data, callback)
}


// 获取歌单列表
export function getDisclist() {
  const url = '/api/getDisclist'

  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 歌单函数
export function getSongList(disstid){
  const url = `/api/getSongList`;
  const data = Object.assign({}, commonParams, {
      disstid:disstid,
      type: 1,
      json: 1,
      utf8: 1,
      onlysong: 0,
      platform: 'yqq',
      hostUin: 0,
      needNewCode: 0,
      format: 'jsonp'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
