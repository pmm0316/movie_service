/**
 * CREATED DATE: 2019/2/1 12:03:02
 * author: mingmingbuzai
 * email: 847679250@qq.com
 */
const express = require('express');
const router = express.Router();
const Response = require('../common/response')
const movie = require('../models/movie')

router.post('/detail', (req, res, next) => {
  let params = req.body
  if (!params.movie_id) {
    res.json(new Response('电影id错误').hasError())
  }
  movie.findById(params.movie_id, (err, movieDetail) => {
    if (err) {
      res.json(new Response('查询电影详情失败').hasError(err))
    }
    res.json(new Response('查询电影详情成功').hasError(movieDetail))
  })
})

module.exports = router;