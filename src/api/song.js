import {commonParams} from '../common/js/config';
import {ERR_OK, jsonp} from '../common/js/config';
import axios from 'axios';
import {Base64} from 'js-base64';

export function getLyric(mid) {
  const url = '/api/lyric'

  const data = Object.assign({}, commonParams, {
    songmid: mid,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    categoryId: 10000000,
    pcachetime: +new Date(),
    format: 'jsonp'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
// 暴露歌曲的类
export default class Song {
  constructor({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }
  getLyric(){
    // 做一个小小的优化
    // 因为我们不能每次都去请求这个函数
    // 所以我们要判断一下歌词是否尊在
    if(this.lyric){
      return Promise.resolve(this.lyric);
    }
    return new Promise((resolve, reject)=>{
      // 成功执行resolve()回调函数
      getLyric(this.mid).then(res=>{
        if(res.retcode===ERR_OK){
          this.lyric = Base64.decode(res.lyric);
          console.log(this.lyric)
          resolve(this.lyric);
        }else{
          // 失败执行reject()回调函数
          reject("no lyric");
        }
      })
    })
  }
}

// 创建歌曲实例
export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://ws.stream.qqmusic.qq.com/C100${musicData.songmid}.m4a?fromtag=0&guid=126548448`
  })
}

// 处理一下歌手的名字
// 遍历歌手名字，以‘/’连接
export function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}

