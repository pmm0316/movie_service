/**
 * CREATED DATE: 2019/1/28 16:07:07
 * author: mingmingbuzai
 * email: 847679250@qq.com
 */
const mongoose = require('../common/db')

const comment = new mongoose.Schema({
  movie_id: String,
  username: String,
  context: String,
  check: Boolean
})

comment.statics.findByMovieId = function (m_id, callBack) {
  this.find({movie_id: m_id, check: true}, callBack)
}

comment.statics.findAll = function (callBack) {
  this.find({}, callBack)
}

let commentModel = mongoose.model('comment', comment)
module.exports = commentModel