import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
// 下面文件加载为同步的
import Recommend from '@/components/recommend/recommend'
import Search from '@/components/search/search'
import Singer from '@/components/singer/singer'
import Rank from '@/components/rank/rank'
import SingerDetail from '@/components/singer-detail/singer-detail'
import Disc from '@/components/disc/disc'
import TopList from '@/components/top-list/top-list'
import UserCenter from '@/components/user-center/user-center'


// 将路由变成懒加载，也就是按需加，异步加载
// 文件加载优化
// const Recommend = (resolve)=>{
//   import('@/components/recommend/recommend').then((recommend)=>{
//     resolve(recommend);
//   })
// }
// const Singer = (resolve)=>{
//   import('@/components/singer/singer').then((singer)=>{
//     resolve(singer);
//   })
// }
// const Rank = (resolve)=>{
//   import('@/components/rank/rank').then((rank)=>{
//     resolve(rank);
//   })
// }
// const Search = (resolve)=>{
//   import('@/components/search/search').then((search)=>{
//     resolve(search);
//   })
// }
// const SingerDetail = (resolve)=>{
//   import('@/components/singer-detail/singer-detail').then((singerDtail)=>{
//     resolve(singerDtail);
//   })
// }
// const Disc = (resolve)=>{
//   import('@/components/disc/disc').then((disc)=>{
//     resolve(disc);
//   })
// }
// const TopList = (resolve)=>{
//   import('@/components/top-list/top-list').then((toList)=>{
//     resolve(topList);
//   })
// }
// const UserCenter = (resolve)=>{
//   import('@/components/user-center/user-center').then((userCenter)=>{
//     resolve(userCenter);
//   })
// }
Vue.use(Router)

export default new Router({
  mode:'history',
  base:'/dist/',
  routes: [
    {
      path: '/',
      redirect: '/recommend',
    },
    {
    	path: '/recommend',
    	name: 'recommend',
    	component: Recommend,
      children: [
        {
          path: ':id',
          component: Disc
        }
      ]
    },
    {
    	path: '/search',
    	name: 'search',
    	component: Search,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
    	path: '/singer',
    	name: 'singer',
    	component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
    	path: '/rank',
    	name: 'rank',
    	component: Rank,
      children: [
        {
          path: ':id',
          component: TopList
        }
      ]
    },
    {
      path: '/user',
      component: UserCenter
    }
  ]
})
