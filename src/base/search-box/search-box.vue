<template>
  <div class="search-box">
    <i class="icon-search" ></i>
    <input ref="query" class="box" :placeholder="placeholder" v-model="query"/>
    <i v-show="query" class="icon-dismiss" @click="clearQuery"></i>
  </div>
</template>
<script type="text/ecmascript-6">
  import {debounce} from '../../common/js/util'
  export default {
  	data(){
  		return {
  			query: ''
  		}
  	},
    props: {
      placeholder: {
        type: String,
        default: '搜索歌曲、歌手'
      }
    },
    methods: {
      blur(){
        this.$refs.query.blur();
      },
    	clearQuery(){
    		this.query = ''
    	},
    	setQuery(query){
    		this.query = query;
    	}
    },
    created(){
    	// 监听组件是否查询
    	// 如果在查询，我们就暴露一个方法
    	this.$watch('query',debounce((newQuery)=>{
        this.$emit('query',newQuery);
      },200))
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .search-box
    display: flex
    align-items: center
    box-sizing: border-box
    width: 100%
    padding: 0 6px
    height: 40px
    background: $color-highlight-background
    border-radius: 6px
    .icon-search
      font-size: 24px
      color: $color-background
    .box
      flex: 1
      margin: 0 5px
      line-height: 25px
      background: $color-highlight-background
      color: $color-text
      font-size: $font-size-medium
      &::placeholder
        color: $color-text-d
    .icon-dismiss
      font-size: 16px
      color: $color-background
</style>