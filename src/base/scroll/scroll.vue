<template>
	<div ref="wrapper">
		<slot></slot>
	</div>
</template>

<script type="text/javascript">
import BetterScroll from 'better-scroll';
export default{
	name: 'scroll',
	data(){
		return {

		}
	},
	props: {
		// 屏幕滚动超过一定的距离是否需要派发scroll事件
		// 当 probeType 为 1 的时候，会非实时（屏幕滑动超过一定时间后）派发scroll 事件
		probeType: {
			type: Number,
			default: 1
		},
		click: {
			type: Boolean,
			default: true,
		},
		data: {
			type: Array,
			default: null
		},
		refreshDelay: {
			type: Number,
			default: 20
		},
		listenScroll: {
			type: Boolean,
			default: false
		},
		// 是否实现上啦刷新
		pullup: {
			type: Boolean,
			default: false
		},
		// 在滚动之前派发事件
		beforeScroll: {
			type: Boolean,
			default: false
		}
	},
	mounted(){
		setTimeout(()=>{
			this._initScroll();
		},this.refreshDelay)
	},
	methods: {
		_initScroll(){
			// 如果wrapper这个元素不存在，就直接返回
			if (!this.$refs.wrapper) {
	          return
	        }
			this.scroll = new BetterScroll(this.$refs.wrapper,{
				probeType:this.probeType,
				click: this.click
			});

			if(this.listenScroll){
				let that = this;
				// 监听scroll组件滚动时，右侧的快速入口联动
				this.scroll.on('scroll',(pos)=>{
					console.log("scroll组件"+pos);
					that.$emit('scroll',pos);//派发一个事件，让子组件接受
				})
			}
			// 监听下拉刷新
			if(this.pullup){
				console.log('pullup')
				this.scroll.on('scrollEnd',()=>{
					if(this.scroll.y <= (this.scroll.maxScrollY + 50)){
						// 如果小于，则表示快要滚动到底部了
						// 派发滚动到底部的事件
						this.$emit('scrollToEnd');
						console.log(1)
					}
				})
			}

			if(this.beforeScroll){
				this.scroll.on('breforeScrollStart',()=>{
					this.$emit('beforeScroll');
				})
			}
		},
		enable(){
			// 检测scroll是否存在
			// 如果存在启动better-scroll
			this.scroll && this.scroll.enable();
		},
		disable(){
			// 检测scroll是否存在
			// 如果存在禁止better-scroll
			this.scroll && this.scroll.disable();
		},
		refresh(){
			// 检测scroll是否存在
			// 如果存在刷新better-scroll
			this.scroll && this.scroll.refresh();
		},
		// 监听滚动
		scrollTo(){
			this.scroll && this.scroll.scrollTo.apply(this.scroll,arguments);
		},
		// 监听滚动到某个元素
		scrollToElement(){
			this.scroll && this.scroll.scrollToElement.apply(this.scroll,arguments);
		}
	},
	watch:{
		data(){
			setTimeout(()=>{
				this.refresh();
			},this.refreshDelay)
		}
	}
}
</script>