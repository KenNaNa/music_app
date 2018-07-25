<template>
  <transition name="slide">
    <music-list :title="title" :bgImage='bgImage' :songs='songs'></music-list>
  </transition>
</template>

<script type="text/javascript">
	import musicList from '../../components/music-list/music-list'
	import {mapGetters} from 'vuex'
	import {getSongList} from '../../api/recommend'
	import {ERR_OK} from '../../common/js/config'
	import {createSong} from '../../api/song'
	export default {
		data(){
			return {
				songs: []
			}
		},
		created(){
			this._getSongList();
		},
		methods: {
			_getSongList(){
				if(!this.disc.dissid){
					this.$router.push('/recommend');
					return ;
				}
				getSongList(this.disc.dissid).then(res=>{
					if(res.code===ERR_OK){
						this.songs = this._normalizeSongs(res.cdlist[0].songlist)
						console.log(res.cdlist[0].songlist);
					}
				})
			},
			_normalizeSongs(list){
		   		let ret = []
		        list.forEach((musicData) => {
		          if (musicData.songid && musicData.albummid) {
		            ret.push(createSong(musicData))
		          }
		        })
		        return ret
		   }
		},
		computed: {
			title(){
				console.log('hahaahhaah ',this.disc)
				return this.disc.dissname;
			},
			bgImage(){
				return this.disc.imgurl;
			},
			...mapGetters([
				'disc'
			]),
		},
		components: {
			musicList,
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>