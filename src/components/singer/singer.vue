<template>
  <div class="singer" ref="singer">
    <!-- <list-view @select="selectSinger" :data="singers" ref="list"></list-view> -->
    <keep-alive>
    	<list-view :data='singers' @select='selectSinger' ref='list'></list-view>
    </keep-alive>
    <router-view></router-view>
  </div>
</template>

<script type="text/javascript">
import {getSingerList} from '../../api/singer';
import {ERR_OK} from '../../common/js/config';
import {Singer} from '../../common/js/singer';
import ListView from '../../base/listview/listview';
import {mapMutations} from 'vuex';
import playlistMixin from '../../api/mixin';
// 我们将获取到的数据的前10条，作为热门数据来处理
// 剩下的数据就用A,B,C...的26个字母去分割
const HOT_SINGER_LEN = 10
const HOT_NAME = '热门'
	export default{
		name: 'singer',
		mixins: [playlistMixin],
		data(){
			return {
				singers: [],
			}
		},
		created(){
			this._getSingerList();
		},
		methods:{
			// 实现 mixin里面的handlerPlaylist
		    handlerPlaylist(list){
		       const bottom = list.length>0 ? '60px' : '';
		       this.$refs.singer.style.bottom = bottom;
		       this.$refs.list.refresh(); 
		    },
			...mapMutations({
		        setSinger: 'SET_SINGER'
		    }),
			// 接受listview组件传递过来的函数
			selectSinger(singer){
				// 添加跳转路由
				this.$router.push({
					path: `/singer/${singer.id}`
				})
				// console.log(singer)
				// console.log(this.setSinger)
				// 下面映射之后，调用
				// 本来是this.$store.commit('setSinger',singer);
				// 现在变成以下这样
				this.setSinger(singer)
			},
			// 获取歌手列表
			_getSingerList(){
				getSingerList().then(res=>{
		          if(res.code===ERR_OK){
		          	console.log(res);
		            this.singers = this._normalizeSinger(res.data.list);
		            console.log(this.singers);
		          }
		        })
			},
			// 处理歌手列表的数据
			_normalizeSinger(list){
				// hot是用来预存热门数据的
				const map = {
					hot: {
						title: HOT_NAME,
						items: []
					}
				};
				// 遍历热门数据保存于items里面
				list.forEach(function(item,index){
					// 根据index找到前10条数据
					if(index<HOT_SINGER_LEN){
						map.hot.items.push(new Singer({
							id: item.Fsinger_mid,
							name: item.Fsinger_name
						}))
					}

					// 接下来遍历剩余的数据，用26个字母去分割他们
					const key = item.Findex;
					// 判断这个key是否存在，存在则保存数据，否则跳过，保证数据只遍历一次
					if(!map[key]){
						map[key] = {
							title: key,
							items: []
						}
					}
					// 处理数据
					map[key].items.push(new Singer({
						id: item.Fsinger_mid,
						name: item.Fsinger_name
					}))
				})
				// 为了得到有序列表，我们需要处理 map
				let ret = [];
				let hot = [];
				for(let key in map){
					const val = map[key];
					// 匹配字母顺序
					if(val.title.match(/[a-zA-Z]/)){
						ret.push(val);
					}
					if(val.title===HOT_NAME){
						hot.push(val);
					}
				}
				// 排序
				ret.sort((a, b) => {
		          return a.title.toLowerCase().charCodeAt(0) - b.title.toLowerCase().charCodeAt(0)
		        })
		        return hot.concat(ret);
			},
			
		},
		components: {
			ListView
		}

	}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>