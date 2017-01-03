var express = require('express');
var router = express.Router();

var EventProxy = require('eventproxy')
var superagent = require('superagent');
var cheerio = require('cheerio');
var fs = require('fs');
var path = require('path');

router.get('/', function(req, res, next) {
    var data = require('./data/data.json');
    res.send(data[0])
    // console.log('开始抓取页面');
    // var ep = new EventProxy();
    // // eq.all('postList', function(postList) {
    // //     console.log('数据已经获取');
    // //     postList.concat(postList);
    // //     console.log(postList);
    // //     //res.send();
    // // });
    // ep.after('postList', 3, function(data) {
    //     console.log(data);
    //     console.log('数据已经获取');
    //     var out = fs.createWriteStream('./data/data.json')
    //     data.map(function(item) {
    //         out.write(JSON.stringify(item))
    //     });
    //
    //     out.on('drain', function() {
    //         console.log('数据已经全部输出!');
    //     })
    //
    //     res.send(data[0]);
    // });
    // for(var i = 1; i < 4; i++) {
    //     console.log('开始抓取页面https://www.cnblogs.com/#p' + i);
    //     superagent
    //         .get('https://www.cnblogs.com/#p' + i)
    //         .end(function(err, sres) {
    //             if(err) {
    //                 console.log('抓取出错');
    //                 return next()
    //             }
    //             var data = [];
    //             var $ = cheerio.load(sres.text);
    //             var $cell = $('#post_list .post_item');
    //             $cell.each(function(key, item) {
    //                 data.push({
    //                     link: $('.titlelnk', item).attr('href'),
    //                     title: $('.titlelnk', item).text(),
    //                     desc: $('.post_item_summary', item).text()
    //                 })
    //             });
    //             ep.emit('postList', data);
    //         });
    // }

    //res.render('index')
});

module.exports = router;