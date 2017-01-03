var express = require('express');
var router = express.Router();

var EventProxy = require('eventproxy')
var superagent = require('superagent');
var cheerio = require('cheerio');

router.get('/', function(req, res, next) {
    console.log('开始抓取页面');
    var eq = new EventProxy();
    eq.all('postList', function(postList) {
        console.log('数据已经获取');
        postList.concat(postList);
        console.log(postList);
        //res.send();
    });
    for(var i = 1; i < 4; i++) {
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
                eq.emit('postList', data);
            });
    }

    console.log('end')
    //res.render('index')
});

module.exports = router;