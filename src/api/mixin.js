import {mapGetters} from 'vuex';
const playlistMixin = {
	computed:{
		...mapGetters([
			'playlist',
		])
	},
	mounted(){
		this.handlePlaylist(this.playlist);
	},
	activated(){
		this.handlerPlaylist(this.playlist);
	},
	methods: {
		handlerPlaylist(val){
			throw new Error('component must implement handlePlaylist method')
		}
	},
	watch: {
		playlist(newVal){
			this.handlePlaylist(newVal)
		}
	}
}

export default {
	playlistMixin
}