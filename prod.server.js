const config = require('./config')
const express = require('express')
const axios = require('axios')

// 后台接口代理以一种欺骗的形式
const app = express();
const apiRoutes = express.Router();

app.get('/api/getTopList',function(req,res){
        var url = "https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg";
        axios.get(url,{
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          }, 
          params: req.query
        }).then(response=>{
          res.json(response.data)
        }).catch(e=>{
          console.log(e);
        })
      });
      app.get('/api/getDisclist', function (req, res) {
        var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          res.json(response.data)
        }).catch((e) => {
          console.log(e)
        })
      });
      app.get('/api/lyric',function(req,res){
        var url = "https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg";
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          // 这里我们要判断response.data是不是json
          var data = response.data;
          var ret = null;
          if(typeof data === 'string'){
            // 匹配jsonp字符串
            // 如果匹配到的话
            // 就转换为json格式
            var reg = /^\w+\(({[^()]+})\)$/;
            var matches = data.match(reg);
            if(matches){
              ret = JSON.parse(matches[1]);
            }
          }
          res.json(ret)
        }).catch((e) => {
          console.log(e)
        })
      });
      app.get('/api/getSongList', function (req, res) {
        var url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
        axios.get(url, {
          headers: {
            referer: 'https://y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          // 这里我们要判断response.data是不是json
          var data = response.data;
          console.log(data)
          console.log(typeof data);
          // res.json(data)
          var ret = null;
          if(typeof data === 'string'){
            // 匹配jsonp字符串
            // 如果匹配到的话
            // 就转换为json格式
            var reg = /^\w+\(({.+})\)$/;
            var matches = data.match(reg);
            console.log(matches)
            if(matches){
              ret = JSON.parse(matches[1]);
            }
          }
          res.json(ret)
        }).catch((e) => {
          console.log(e)
        })
      });
app.use('/api', apiRoutes);
 app.use(express.static('./dist'))

 var port = process.env.PORT || config.build.port

 module.exports = app.listen(port,function(err){
 	if(err){
 		console.log(err);
 	}

 	console.log('port'+port);
 });