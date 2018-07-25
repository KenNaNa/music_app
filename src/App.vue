<template>
  <div id="app" >
    <MHeader/>
    <Tab class="needsclick"/>
    <!-- 加个keep-alive是为了防止每次都去请求数据，重新渲染DOM所以 -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    
    <player></player>

  </div>
</template>

<script>
import MHeader from './components/m-header/m-header';
import Tab from "./components/tab/tab";
import Player from './components/player/player';
export default {
  name: 'App',
  data(){
    return {
      
    }
  },
  components:{
    MHeader,
    Tab,
    Player
  }
}
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
@import "./common/stylus/variable"
#app
  color: $color-theme;
</style>
