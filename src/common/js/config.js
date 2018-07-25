export const playMode = {
  sequence: 0,
  loop: 1,
  random: 2
}

// QQ音乐的Query Params 公共的参数
// 轮播图数据的查询字段
export const commonParams = {
  g_tk: 1928093487,
  inCharset: 'utf-8',
  outCharset: 'utf-8',
  notice: 0,
  format: 'jsonp'
}

export const options = {
  param: 'jsonpCallback'
}

// 以及options
// jsonp格式的回调函数
// ?g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&_=1529163666614
export const callback = {
	param: "jsonpCallback"
}

// 全部歌单的查询字段
export const playListParams = {
	picmid: 1,
	rnd: Math.random(),
	g_tk: 5381,
	loginUin: 0,
	hostUin: 0,
	format: "json",
	inCharset: "utf8",
	outCharset: "utf-8",
	notice: 0,
	platform: "yqq",
	needNewCode: 0,
	categoryId: 10000000,
	sortId: 5,
	sin: 0,
	ein: 29,
}
// 请求成功
export const ERR_OK = 0;


