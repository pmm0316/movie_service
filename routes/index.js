var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')
const recommend = require('../models/recommend')
const movie = require('../models/movie')
const article = require('../models/article')
const Response = require('../common/response')


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/mongooseTest', function (req, res, next) {
  mongoose.connect('mongodb://localhost/pets', {
    useMongoClient: true
  })
  mongoose.Promise = global.Promise
  var Cat = mongoose.model('Cat', {name: String})
  var tom = new Cat({name: 'Tom'})
  tom.save(function (err) {
    if (err) {
      console.log(err)
    } else {
      console.log('success insert')
    }
  })
  res.send('数据库连接测试')
})

// 显示主页的推荐大图等
router.get('/showIndex', function (req, res, next) {
  recommend.findAll((err, getRecommend) => {
    if (err) {
      res.json(new Response('获取大图失败').hasError(err))
    }
    res.json(new Response('获取成功').hasData(getRecommend))
  })
})

// 显示所有的排行榜，也就是对于电影字段index的样式
router.get('/showRanking', function (req, res, next) {
  movie.find({movieMainPage: true}, (err, getMovies) => {
    if (err) {
      res.json(new Response('获取电影失败').hasError(err))
    }
    res.json(new Response('获取电影列表成功').hasData(getMovies))
  })
})

// 显示文章列表
router.get('/showArticle', function (req, res, next) {
  console.log('showArticle')
  article.findAll((err, getArticles) => {
    if (err) {
      res.json(new Response('获取文章列表失败').hasError(err))
    }
    res.json(new Response('获取文章列表成功').hasData(getArticles))
  })
})

// 显示文章内容
router.post('/articleDetail', function (req, res, next) {
  let params = req.body
  if (!params.article_id) {
    res.json(new Response('文章id出错').hasError())
  }
  article.findByArticleId(params.article_id, (err, getArticle) => {
    if (err) {
      res.json(new Response('获取文章详情失败').hasError(err))
    }
    res.json(new Response('获取文章详情成功').hasData(getArticle))
  })
})

// 显示用户个人信息的内容
router.post('/showUser', function (req, res, next) {

})

module.exports = router;
