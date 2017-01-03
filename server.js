var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var config = require('config-lite');
var winston = require('winston');
var expressWinston = require('express-winston');

var app = express();

//require middlewares

app.use(bodyParser.urlencoded({ extended: false }));
app.set('views', path.join(__dirname, 'views'));// 设置存放模板文件的目录
app.set('view engine', 'ejs');// 设置模板引擎为 ejs
app.use(express.static(path.join(__dirname, 'statics')));

app.use(expressWinston.logger({
    transports: [
        new (winston.transports.Console)({
            json: true,
            colorize: true
        }),
        new winston.transports.File({
            filename: 'logs/success.log'
        })
    ]
}));

app.use('/', require('./routes/index'));
//app.use(router);
//route(app);
app.use(expressWinston.errorLogger({
    transports: [
        new winston.transports.Console({
            json: true,
            colorize: true
        }),
        new winston.transports.File({
            filename: 'logs/error.log'
        })
    ]
}));

app.listen(config.port, err => {
    if(err) {
        throw new Error(err);
    }else {
        console.log('app has listenning port %d', config.port);
}
})