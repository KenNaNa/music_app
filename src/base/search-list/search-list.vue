<template>
  <div class="search-list" v-show="searches.length">
    <transition-group name="list" tag="ul">
      <li :key="item" class="search-item" @click="selectItem(item)" v-for="item in searches">
        <span class="text">{{item}}</span>
        <!-- 
          stop是阻止事件冒泡
          因为li标签有点击事件 
        -->
        <span class="icon" @click.stop="deleteOne(item)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      // 传入我们需要渲染的数据
      searches: {
        type: Array,
        default: []
      }
    },
    methods: {
      // 选中添加的列表项时
      // 派发一个事件，通知外部已经点击列表项了
      // 外部去处理这个事件
      selectItem(item) {
        this.$emit('select', item)
      },
      // 点击删除按钮时，
      // 派发一个删除事件
      // 让外部去处理
      deleteOne(item) {
        this.$emit('delete', item)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .search-list
    .search-item
      display: flex
      align-items: center
      height: 40px
      overflow: hidden
      &.list-enter-active, &.list-leave-active
        transition: all 0.1s
      &.list-enter, &.list-leave-to
        height: 0
      .text
        flex: 1
        color: $color-text-l
      .icon
        extend-click()
        .icon-delete
          font-size: $font-size-small
          color: $color-text-d
</style>