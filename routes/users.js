const express = require('express');
const crypto = require('crypto')
const router = express.Router();
const user = require('../models/user')
const comment = require('../models/comment')
const movie = require('../models/movie')
const mail = require('../models/mail')
const Response = require('../common/response')

// 登录
router.post('/login', (req, res, next) => {
  let params = req.body
  if (!params.username) {
    res.json(new Response('用户名为空').hasError())
  }
  if (!params.password) {
    res.json(new Response('密码为空').hasError())
  }
  user.findUserLogin(params.username, params.password, (err, userSave) => {
    if (userSave.length !== 0) {
      let token_after = getMD5Password(userSave[0]._id)
      res.json(new Response('用户登录成功').hasData({
        user: userSave[0],
        token: token_after
      }))
    } else {
      res.json(new Response('用户名或者密码错误').hasError())
    }
  })
})
// 注册
router.post('/register', (req, res, next) => {
  let params = req.body
  if (!params.username) {
    res.json({status: 1, message: '用户名为空'})
  }
  if (!params.password) {
    res.json({status: 1, message: '密码为空'})
  }
  if (!params.userMail) {
    res.json({status: 1, message: '邮箱为空'})
  }
  if (!params.userPhone) {
    res.json({status: 1, message: '用户手机为空'})
  }
  user.findByUsername(params.username, (err, userSave) => {
    if (userSave.length !== 0) {
      // 返回错误信息
      res.json(new Response('用户已注册').hasError())
    } else {
      let registerUser = new user({
        username: params.username,
        password: params.password,
        userMail: params.userMail,
        userPhone: params.userPhone,
        userAdmin: 0,
        userPower: 0,
        userStop: 0
      })
      registerUser.save(() => {
        res.json(new Response('注册成功'))
      })
    }
  })
})
// 用户提交评论
router.post('/postComment', (req, res, next) => {
  let username = req.body.username
  if (!username) {
    username = '匿名用户'
  }
  if (!req.body.movie_id) {
    res.json(new Response('电影id为空').hasError())
  }
  if (!req.body.context) {
    res.json(new Response('电影评论为空').hasError())
  }
  let saveComment = new comment({
    movie_id: req.body.movie_id,
    username: username,
    context: req.body.context,
    check: true
  })
  // 保存
  saveComment.save((err) => {
    if (err) {
      res.json(new Response('评论保存失败').hasError(err))
    } else {
      res.json(new Response('评论保存成功'))
    }
  })
})
// 用户点赞
router.post('/support', (req, res, next) => {
  let movie_id = req.body.movie_id
  if (!movie_id) {
    res.json(new Response('电影id传输错误').hasError())
  }
  movie.findById(movie_id, (err, supportMovie) => {
    if (supportMovie) {
      movie.update({
        _id: movie_id,
        movieNumSuppose: supportMovie.movieNumSuppose + 1
      }, (err) => {
        if (err) {
          res.json(new Response('电影点赞数修改失败').hasError(err))
        }
        res.json(new Response('电影点赞数修改成功'))
      })
    } else {
      res.json(new Response('找不到该电影').hasError())
    }
  })
})
// 用户找回密码
router.post('/findPassword', (req, res, next) => {
  let params = req.body
  if (params.repassword) {
    if (params.token) {
      // 登录状态后，修改密码
      if (!params.user_id) {
        res.json(new Response('用户登录错误').hasError())
      }
      if (!params.password) {
        res.json(new Response('用户老密码错误').hasError())
      }
      if (params.token === getMD5Password(params.user_id)) {
        // 根据老密码和id查询用户是否存在
        user.findOne({
          _id: params.user_id,
          password: params.password
        }, (err, checkUser) => {
          if (!checkUser) {
            res.json(new Response('用户老密码错误').hasError())
          } else {
            // 更新用户密码
            user.update({
              _id: params.user_id,
              password: params.repassword
            }, (err, userUpdate) => {
              if (err) {
                res.json(new Response('更改错误').hasError(err))
              } else {
                res.json(new Response('更改成功').hasData(userUpdate))
              }
            })
          }
        })
      } else {
        res.json(new Response('用户登录错误').hasError())
      }
    } else {
      // 非登录状态，修改密码
      user.findUserPassword(params.username, params.userMail, params.userPhone, (err, userFound) => {
        if (userFound.length !== 0) {
          user.update({
            _id: userFound[0]._id,
            password: params.repassword
          }, (err, userUpdate) => {
            if (err) {
              res.json(new Response('更改错误').hasError(err))
            } else {
              res.json(new Response('更改成功').hasData(userUpdate))
            }
          })
        } else {
          res.json(new Response('信息错误').hasError())
        }
      })
    }
  } else {
    // 这里只是验证mail和phone，返回验证成功提示和提交的字段，用于之后改密码的操作
    if (!params.username) {
      res.json(new Response('用户名称为空').hasError())
    }
    if (!params.userMail) {
      res.json(new Response('用户邮箱为空').hasError())
    }
    if (!params.userPhone) {
      res.json(new Response('用户手机为空').hasError())
    }
    user.findUserPassword(params.username, params.userMail, params.userPhone, (err, userFound) => {
      if (userFound.length !== 0) {
        res.json(new Response('验证成功，请修改密码').hasData({
          username: params.username,
          userMail: params.userMail,
          userPhone: params.userPhone
        }))
      } else {
        res.json(new Response('信息错误').hasError())
      }
    })
  }
})

router.post('/download', (req, res, next) => {
  console.log('download')
  let movie_id = req.body.movie_id
  if (!movie_id) {
    res.json(new Response('电影id传输失败').hasError())
  }
  movie.findById(movie_id, (err, supportMovie) => {
    if (supportMovie) {
      movie.update({
        _id: movie_id,
        movieNumDownload: supportMovie.movieNumDownload + 1
      }, (err) => {
        if (err) {
          res.json(new Response('电影下载数修改失败').hasError(err))
        }
        res.json(new Response('电影下载数修改成功'))
      })
    } else {
      res.json(new Response('找不到该电影').hasError())
    }
  })
})
// 用户发送站内信
router.post('/sendEmail', (req, res, next) => {
  let params = req.body
  if (!params.token) {
    res.json(new Response('用户登录状态错误').hasError())
  }
  if (!params.user_id) {
    res.json(new Response('用户登录状态出错').hasError())
  }
  if (!params.toUserName) {
    res.json(new Response('未选择相关的用户').hasError())
  }
  if (!params.title) {
    res.json(new Response('标题不能为空').hasError())
  }
  if (!params.context) {
    res.json(new Response('内容不能为空').hasError())
  }
  if (params.token === getMD5Password(params.user_id)) {
    user.findByUsername(params.toUserName, (err, toUser) => {
      if (toUser.length !== 0) {
        let newEmail = new mail({
          fromUser: params.user_id,
          toUser: toUser[0]._id,
          title: params.title,
          context: params.context
        })
        newEmail.save((err) => {
          if (!err) {
            res.json(new Response('发送成功'))
          }
          res.json(new Response('发送失败').hasError(err))
        })
      } else {
        res.json(new Response('您发送的对象不存在').hasError(err))
      }
    })
  } else {
    res.json(new Response('用户登录错误').hasError())
  }
})
// 用户显示站内信，其中receive参数值是1时是发送的内容，值为2时是收到的内容
router.post('/showEmail', (req, res, next) => {

})

const init_token = 'TKL02o'
function getMD5Password (id) {
  let md5 = crypto.createHash('md5')
  let token_before = id + init_token
  return md5.update(token_before).digest('hex')
}

module.exports = router;
