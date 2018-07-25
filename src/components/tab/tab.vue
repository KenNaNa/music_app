<template>
	<div class="tab">
		<router-link tag='div' class="tab-item needsclick" to="/recommend">
			<span class="tab-link needsclick">推荐</span>
		</router-link>
		<router-link tag='div' class="tab-item needsclick" to="/singer">
			<span class="tab-link needsclick">歌手</span>
		</router-link>
		<router-link tag='div' class="tab-item needsclick" to="/rank">
			<span class="tab-link needsclick">排行</span>
		</router-link>
		<router-link tag='div' class="tab-item needsclick" to="/search">
			<span class="tab-link needsclick">搜索</span>
		</router-link>
	</div>
</template>

<script type="text/javascript">
	export default{
		name: 'tab',
		data(){
			return {

			}
		},

	}
</script>
<style lang="stylus" scoped>
@import "~common/stylus/variable"
.tab	
	display: flex
	height: 44px
	text-align: center
	line-height: 44px
	font-size: $font-size-medium
	
	.tab-item
		flex: 1
		text-align: center
		
		.tab-link
			padding-bottom: 5px
			color: $color-text-l
		&.router-link-active
			.tab-link
				color: $color-theme
				border-bottom: 2px solid $color-theme

.fade-enter-active, .fade-leave-active {
  transition: opacity .3s ease;
}
.fade-enter, .fade-leave-to
/* .component-fade-leave-active for below version 2.1.8 */ {
  opacity: 0;
}					
</style>