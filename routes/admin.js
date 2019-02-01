/**
 * CREATED DATE: 2019/2/1 08:02:33
 * author: mingmingbuzai
 * email: 847679250@qq.com
 */
const express = require('express');
const router = express.Router();

router.post('/moviewAdd', (req, res, next) => {
  let params = req.body
  if (!params.token) {
    res.json(new Response('登录出错').hasError())
  }
  if (!params.username) {
    res.json(new Response('用户名为空').hasError())
  }
  if (!params.id) {
    res.json(new Response('用户传递错误').hasError())
  }
  if (!params.movieName) {
    res.json(new Response('电影名称为空').hasError())
  }
  if (!params.movieImg) {
    res.json(new Response('电影图片为空').hasError())
  }
  if (!params.movieDownload) {
    res.json(new Response('电影下载地址为空').hasError())
  }
})

module.exports = router;