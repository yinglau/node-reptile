var express = require('express');
var router = express.Router();

var EventProxy = require('eventproxy')
var superagent = require('superagent');
var cheerio = require('cheerio');
var fs = require('fs');
var path = require('path');


/**
 * @param siteUrlString
 * @param totalPage
 * @returns {Array}
 */
function getPostUrl(siteUrlString, totalPage) {

}

router.get('/', function(req, res, next) {
    var ep = new EventProxy();
    var result = [];
    var j = 1;
    for(var i = 1; i < 9; i++) {
        superagent
            .post('https://www.cnblogs.com/mvc/AggSite/PostList.aspx')
            .send({CategoryType: "SiteHome", ParentCategoryId: 0, CategoryId: 808, PageIndex: i, TotalPostCount: 4000})
            .end(function(err, sres) {
                if(err) {
                    console.log('抓取出错');
                }
                //res.send(sres.text);
                var $ = cheerio.load(sres.text);
                var $cell = $('.post_item');
                var data = [];
                $cell.each(function(key, item) {
                    data.push({
                        link: $('.titlelnk', item).attr('href'),
                        title: $('.titlelnk', item).text(),
                        desc: $('.post_item_summary', item).text()
                    });
                    //data.push($('.titlelnk', item).attr('href'));
                });
                ep.emit('urlsData', data)
            });
    }

    //ep.tail('urlsData', function(urlsData) {
    //    ep.emit('end', result.concat(urlsData));
    //})
    ep.tail('urlsData', function(data) {
        var result = [];
        var urls = result.concat(...data);
        urls.map(function(item) {
            superagent
                .get(item.link)
                .end(function(err, sres) {
                    if(err) {
                        console.log(err);
                        return false;
                    }
                    var $ = cheerio.load(sres.text);
                    var content = $('#cnblogs_post_body').html();
                    item.content = content;
                    ep.emit('end', urls);
                });
        });
    });

    ep.after('end', 20, function(data) {
        var result = [];
        res.render('index', {post: result.concat(...data)})
    });



});

router.get('/index', function(req, res) {
    var data = require('../data/data.json');
    res.render('index', {
        list: data.data
    })
});

module.exports = router;