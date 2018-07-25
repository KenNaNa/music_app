<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"

           @touchstart.prevent="progressTouchStart"
           @touchmove.prevent="progressTouchMove"
           @touchend="progressTouchEnd"
      >
      <!-- .prevent是阻止默认事件 -->
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
const progressBtnWidth = 16;//btn的宽度
	export default{
		name: 'progressBar',
		data(){
			return {

			}
		},
		created() {
			this.touch = {};
		},
		methods: {
			progressClick(e){
				const rect = this.$refs.progressBar.getBoundingClientRect()
        		const offsetWidth = e.pageX - rect.left
        		this._offset(offsetWidth)
        		// 这里当我们点击 progressBtn 的时候，e.offsetX 获取不对
        		// this._offset(e.offsetX)
        		this._triggerPercent()
			},
			progressTouchStart(e){
				this.touch.initiated = true;
				// 记录x坐标
				this.touch.startX = e.touches[0].pageX;
				// 记录进度条的左偏
				this.touch.left = this.$refs.progress.clientWidth;
			},
			progressTouchMove(e){
				// 没有progressTouchStart，就不执行下面的代码
				if(!this.touch.initiated){
					return ;
				}
				// 计算出差值
				const deltaX = e.touches[0].pageX - this.touch.startX;
				// 偏移量
				const offsetWidth = Math.max(0, this.touch.left + deltaX);
				// 然后与总的宽度进行比较
				const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
				const offsetW = Math.min(barWidth, offsetWidth);

				this._offset(offsetW);
			},
			progressTouchEnd(e){
				this.touch.initiated = false;

				this._triggerPercent();
			},
			_triggerPercent(){
				// 进度条的总宽度
				const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
				// progressWidth
				const progressWidth = this.$refs.progress.clientWidth;
				// 百分比
				const percent = progressWidth / barWidth;

				// 派发事件
				this.$emit('percentChange',percent);
			},
			_offset(offsetW){
				// 设置偏移量
				this.$refs.progress.style.width = `${offsetW}px`;

				// 设置按钮的偏移
				this.$refs.progressBtn.style.transform = `translate3d(${offsetW}px,0,0)`;
			}
		},
		props: {
			// 进度条的百分比
			percent: {
				type: Number,
				default: 0
			}
		},
		// 检测percent是否变化
		watch: {
			percent(newPercent){
				// console.log(newPercent);
				// this.touch.initiated在拖拽的时候不受影响
				if(newPercent>=0 && !this.touch.initiated){
					// 进度条的总宽度
					const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
					// btn走过的偏移量
					const offsetWidth = newPercent * barWidth;

					// 设置偏移量
					this.$refs.progress.style.width = `${offsetWidth}px`;

					// 设置按钮的偏移
					this.$refs.progressBtn.style.transform = `translate3d(${offsetWidth}px,0,0)`;
				}
			}
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>