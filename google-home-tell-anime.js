var express = require('express');
var googlehome = require('./google-home-notifier');
var ngrok = require('ngrok');
var bodyParser = require('body-parser');
var app = express();
const serverPort = 8080;

var deviceName = 'Google Home';
googlehome.device(deviceName);

var urlencodedParser = bodyParser.urlencoded({
    extended: false
});

app.post('/google-home-notifier', urlencodedParser, function (req, res) {
    if (!req.body) return res.sendStatus(400)
    getFeed().then(function(value){
        if (value){
            res.send(deviceName + ' will say: ' + value + '\n');
            googlehome.notify(value, function(res) {
                console.log(res);
            });
        } else {
            res.send('今日のアニメはすべて終了したみたいです');
        }
    }).catch(function(error){
        console.log(error);
        if (error){
            res.send(deviceName + ' will say: ' + error + '\n');
            googlehome.notify(error, function(res) {
                console.log(res);
            });
        } else {
            res.send('なんかエラーが起きてるみたいです');
        }
    });
});

app.listen(serverPort, function () {
    ngrok.connect(serverPort, function (err, url) {
        console.log('POST "text=Hello Google Home" to:');
        console.log('    http://localhost:' + serverPort + '/google-home-notifier');
        console.log('    ' + url + '/google-home-notifier');
        console.log('example:');
        console.log('curl -X POST -d "text=Hello Google Home" ' + url + '/google-home-notifier');
    });
});

function getFeed(){
    var FeedParser = require('feedparser');
    var request = require('request');
    var feed = 'http://cal.syoboi.jp/rss.php?usr=[your id]&filter=1&start=today&count=150&days=1&titlefmt=%24(ShortTitle)';

    var req = request(feed);
    var feedparser = new FeedParser({});

    var items = [];

    return new Promise(function(resolve, reject){
        req.on('response', function (res) {
          this.pipe(feedparser);
        });

        feedparser.on('readable', function() {
          while(item = this.read()) {
            // console.log(item);
            items.push(item);
          }
        });

        feedparser.on('end', function() {
            var currentTime = new Date();
            var str = '';
            var maxCount = items.length; //012
            var count = 0;
            items.forEach(function(item) {
                var startTime = item['dc:date']['#'];
                var time = new Date(startTime);
                if(time > currentTime){
                    var chName = item['dc:publisher']['#'];
                    var title = item.title;
                    str += time.getHours() + '時' + time.getMinutes() + '分から' + chName + 'で' + title + '。';
                }
                count++;
                if(count == maxCount && str !== ''){
                    str += '以上です';
                }
            });
            if(str){
                resolve(str);
            } else if(str === '') {
                resolve('今日のアニメはすべて終了したみたいです');
            } else {
                reject('なんかエラーが起きてるみたいです');
            }
        });
    });
}