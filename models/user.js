/**
 * CREATED DATE: 2019/1/28 11:22:28
 * author: mingmingbuzai
 * email: 847679250@qq.com
 */
const mongoose = require('../common/db')

// 用户数据集
const user = new mongoose.Schema({
  username: String,
  password: String,
  userMail: String,
  userPhone: String,
  userAdmin: Boolean,
  userPower: Number,
  userStop: Boolean
})

// 用户查找方法
user.statics.findAll = function (callBack) {
  this.find({}, callBack)
}

/*user.statics.findOne = function (id, password, callBack) {
  this.find({_id: id, password: password}, callBack)
}*/
// 使用用户名查询的方式
user.statics.findByUsername = function (name, callBack) {
  this.find({username: name}, callBack)
}

// 登录匹配是不是拥有相同的用户名和密码并且没有处于封停状态
user.statics.findUserLogin = function (name, password, callBack) {
  this.find({username: name, password: password, userStop: false}, callBack)
}

// 验证邮箱，用户名和电话找到用户
user.statics.findUserPassword = function (name, mail, phone, callBack) {
  this.find({username: name, userMail: mail, userPhone: phone}, callBack)
}

let userModel = mongoose.model('user', user)

module.exports = userModel