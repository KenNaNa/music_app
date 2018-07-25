import {commonParams} from '../common/js/config';
import {ERR_OK,  callback} from '../common/js/config';
import jsonp from '../common/js/jsonp';
import axios from 'axios'

export default function getTopList(){
	const url = '/api/getTopList';
	const data = Object.assign({}, commonParams, {
		g_tk: 5381,
		uin: 0,
		format: "json",
		platform: "h5",
		needNewCode: 1,
	});
	return axios.get(url, {
	    params: data
	}).then((res) => {
	    return Promise.resolve(res.data)
	})
}

export function getMusicList(topid){
	const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg';
	const data = Object.assign({}, commonParams, {
		tpl: 3,
		page: "detail",
		type: "top",
		topid: topid,
		platform: "h5",
		needNewCode: 1
	})

	return jsonp(url, data, callback)
}