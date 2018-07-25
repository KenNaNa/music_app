import {commonParams} from '../common/js/config';
import {ERR_OK,  callback} from '../common/js/config';
import jsonp from '../common/js/jsonp';
import axios from 'axios'

export function getHotKey(){
	const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg';
	const data = Object.assign({}, commonParams, {
		g_tk: 5381,
		uin: 0,
		format: "json",
		inCharset: "utf-8",
		outCharset: "utf-8",
		notice: 0,
		platform: "h5",
		needNewCode: 1,
		_: 1530607012850
	});

	return jsonp(url, data, callback)
}

export function search(query,page,zhida,perpage){
	const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp';
	const data = Object.assign({}, commonParams, {
		g_tk: 5381,
		notice: 0,
		platform: "h5",
		needNewCode: 1,
		w: query,
		zhidaqu: 1,
		catZhida: zhida ? 1 : 0,
		t: 0,
		flag: 1,
		ie: "utf-8",
		sem: 1,
		aggr: 0,
		perpage: perpage,
		n: perpage,
		p: page,
		remoteplace: "txt.mqq.all",
	})

	return jsonp(url, data, callback);
}