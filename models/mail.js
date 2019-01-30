/**
 * CREATED DATE: 2019/1/29 09:38:01
 * author: mingmingbuzai
 * email: 847679250@qq.com
 */
const mongoose = require('../common/db')

let mail = new mongoose.Schema({
  fromUser: String,
  toUser: String,
  title: String,
  context: String
})

// 数据操作的一些常用方法
mail.statics.findByToUserId = function (user_id, callBack) {
  this.find({toUser: user_id}, callBack)
}

mail.statics.findByFromUserId = function (user_id, callBack) {
  this.find({fromUser: user_id}, callBack)
}

let mailModel = mongoose.model('mail', mail)

module.exports = mailModel