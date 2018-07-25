import storage from 'good-storage'

const SEARCH_KEY = '__search__'
// 最大的缓存数据长度
// 每次插入的东西
// 要在最前面
const SEARCH_MAX_LEN = 15

// 最近播放的大小
const PLAY_KEY = '__play__'
const PLAY_MAX_LEN = 200

const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LEN = 200

// 插入数组的函数
// @compare 是指要比较的function 外部传入的函数
// @arr  要插入的数组
// @val  要存的值
// @maxLen 数组的长度
function insertArray(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  // 第一条数据
  if (index === 0) {
    return
  }

  // 先删除一个元素
  // 再往里面添加val
  // 为保证数组的最大长度是15
  if (index > 0) {
    arr.splice(index, 1)
  }
  // 保证插入的值在第一位
  arr.unshift(val)

  if (maxLen && arr.length > maxLen) {
    // 超过最大程度就把数组的最后一个pop()掉
    arr.pop()
  }
}

// 从数组中删除
// 从列表中删除
function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

export function saveSearch(query) {
  // 得到当前的缓存空间
  let searches = storage.get(SEARCH_KEY, [])
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LEN)
  storage.set(SEARCH_KEY, searches)
  return searches
}

// 删除搜索历史
// 先获取缓存中搜索列表
// 从缓存里面删除
export function deleteSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}

// 删除缓存
export function clearSearch() {
  storage.remove(SEARCH_KEY)
  return []
}

// 从本地读取上一次的内容
export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}

export function savePlay(song) {
  let songs = storage.get(PLAY_KEY, [])
  insertArray(songs, song, (item) => {
    return song.id === item.id
  }, PLAY_MAX_LEN)
  storage.set(PLAY_KEY, songs)
  return songs
}

export function loadPlay() {
  return storage.get(PLAY_KEY, [])
}

export function saveFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  insertArray(songs, song, (item) => {
    return song.id === item.id
  }, FAVORITE_MAX_LEN)
  storage.set(FAVORITE_KEY, songs)
  return songs
}

export function deleteFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  deleteFromArray(songs, (item) => {
    return item.id === song.id
  })
  storage.set(FAVORITE_KEY, songs)
  return songs
}

export function loadFavorite() {
  return storage.get(FAVORITE_KEY, [])
}

