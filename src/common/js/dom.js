export function hasClass(el, className) {
  // 使用正则表达式 匹配直接以类名开头或者是以空格开头后面跟着类名的
  // 例如 "active" 或者 "nav active"
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

export function addClass(el, className) {
  // 如果本身类名存在的话，就直接返回
  if (hasClass(el, className)) {
    return
  }
  // 如果没有，就将原有的类名以空格符分开
  // 然后再添加新增的类型
  // 最后再连接成字符串 重新赋值给className
  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

// 设置或者获取当前点击的元素的data-name
// 为歌手列表中的右侧快速入口的方法
export function getData(el, name, val) {
  const prefix = 'data-'
  if (val) {
    // 如果值存在的话，就设置
    return el.setAttribute(prefix + name, val)
  }
  // 不存在的话就获取
  return el.getAttribute(prefix + name)
}

let elementStyle = document.createElement('div').style

let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }

  return false
})()

export function prefixStyle(style) {
  if (vendor === false) {
    return false
  }

  if (vendor === 'standard') {
    return style
  }

  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}
