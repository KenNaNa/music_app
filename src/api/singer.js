import jsonp from '../common/js/jsonp';
import {commonParams,callback,playListParams} from '../common/js/config';


export function getSingerList(){
	const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'

	const data = Object.assign({}, commonParams, {
		channel: 'singer',
		page: 'list',
		key: 'all_all_all',
		pagesize: 100,
		pagenum: 1,
		hostUin: 0,
		needNewCode: 0,
		platform: 'yqq'
	})

  return jsonp(url, data, callback);
}

//获取歌手歌曲
export function getSingerDetail(singerId){
	const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg';
	const data = Object.assign({},commonParams,{
		g_tk: 2140052619,
		loginUin: 528964214,
		hostUin: 0,
		format: "jsonp",
		inCharset: "utf8",
		outCharset: "utf-8",
		notice: 0,
		platform: "yqq",
		needNewCode: 0,
		singermid: singerId,
		order: "listen",
		begin: 0,
		num: 100,
		songstatus: 1
	})
	return jsonp(url, data, callback);
}