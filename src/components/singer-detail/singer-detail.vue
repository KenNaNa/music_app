<template>
	<transition name="slide">
		<music-list :songs="songs" :bgImage='bgImage' :title='title'></music-list>
	</transition>
</template>

<script type="text/javascript">
import {mapGetters} from 'vuex';
import {getSingerDetail} from '../../api/singer';
import {ERR_OK} from '../../common/js/config';
import {createSong} from '../../api/song';
import musicList from '../../components/music-list/music-list';
export default{
	name: 'singerDetail',
	data(){
		return {
			songs: []
		}
	},
	components: {
		musicList
	},
	computed: {
		title(){
			return this.singer.name;
		},
		bgImage(){
			return this.singer.avatar;
		},
	  ...mapGetters([
        'singer'
      ])
	},
	created(){
		console.log('hello')
		console.log(this.singer)
		this._getDetail();
	},
	methods:{
		_getDetail(){
			getSingerDetail(this.singer.id).then((res)=>{
				if(res.code===ERR_OK){
					// console.log(res);
					this.songs = this._normalizeSongs(res.data.list);
					console.log(this.songs);
				}
			})
		},
	   _normalizeSongs(list){
	   		let ret = []
	        list.forEach((item) => {
	          let {musicData} = item
	          if (musicData.songid && musicData.albummid) {
	            ret.push(createSong(musicData))
	          }
	        })
	        return ret
	   }
	}
}	
</script>

<style type="text/css" scoped lang="stylus">
@import "~common/stylus/variable"
.slide-enter-active, .slide-leave-active
	transition: all 0.3s
.slide-enter, .slide-leave-to
		transform: translate3d(100%, 0, 0)
</style>