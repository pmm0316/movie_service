/**
 * CREATED DATE: 2019/1/31 16:04:40
 * author: mingmingbuzai
 * email: 847679250@qq.com
 */
const mongoose = require('../common/db')

let article = new mongoose.Schema({
  articleTitle: String,
  articleContext: String,
  articleTime: String
})

article.statics.findByArticleId = function (id, callBack) {
  this.find({_id: id}, callBack)
}

article.statics.findAll = function (callBack) {
  this.find({}, callBack)
}

let articleModel = mongoose.model('article', article)

module.exports = articleModel