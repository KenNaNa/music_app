import originJsonp from 'jsonp'

export default function jsonp(url, data, option='') {
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)

  return new Promise((resolve, reject) => {
    originJsonp(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

export function param(data) {
  // 因为jsonp返回的数据是json格式的数据
  // 我们转换成那种application-xml-from数据形式的
  // 也就是表单提交的数据格式
  let url = '';
  for (var k in data) {
    let value = data[k] !== undefined ? data[k] : '';
    url += '&' + k + '=' + encodeURIComponent(value);
  }
  // 去掉第一个&
  // 相当于这样 https://www.baidu.com?key=Ken&name=Ken
  return url ? url.substring(1) : '';
}
