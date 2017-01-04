var express = require('express');
var router = express.Router();

var EventProxy = require('eventproxy')
var superagent = require('superagent');
var cheerio = require('cheerio');
var fs = require('fs');
var path = require('path');

router.get('/', function(req, res, next) {

     console.log('开始抓取页面');
     var ep = new EventProxy();
      //ep.all('postList', function(postList) {
      //    console.log('数据已经获取');
      //    postList.concat(postList);
      //    console.log(postList);
      //    //res.send();
      //});
     ep.tail('postList', function(data) {
         console.log('数据已经获取');

     });
     for(var i = 1; i <= 9; i++) {
         console.log('开始抓取页面https://www.cnblogs.com/#p' + i);
         superagent
             .get('https://www.cnblogs.com/#p' + i)
             .end(function(err, sres) {
                 if(err) {
                     console.log('抓取出错');
                     return next()
                 }
                 var data = [];
                 var $ = cheerio.load(sres.text);
                 var $cell = $('#post_list .post_item');
                 $cell.each(function(key, item) {
                     data.push({
                         link: $('.titlelnk', item).attr('href'),
                         title: $('.titlelnk', item).text(),
                         desc: $('.post_item_summary', item).text()
                     })
                 });
                 ep.emit('postList', data);
             });
         console.log('循环结束，开始下次循环')
     }

    //res.render('index')
});

router.get('/index', function(req, res) {
    var data = require('../data/data.json');
    res.render('index', {
        list: data.data
    })
});

module.exports = router;