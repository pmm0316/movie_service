/**
 * CREATED DATE: 2019/1/31 14:44:46
 * author: mingmingbuzai
 * email: 847679250@qq.com
 */
const mongoose  = require('../common/db')

let recommend = new mongoose.Schema({
  recommendImg: String,
  recommendSrc: String,
  recommendTitle: String
})

// 通过id获取主页推荐
recommend.statics.findByuIndexId = (m_id, callBack) => {
  this.find({findByIndexId: m_id}, callBack)
}

// 找到所有的推荐
recommend.statics.findAll = function(callBack) {
  this.find({}, callBack)
}

let recommendModel = mongoose.model('recommend', recommend)

module.exports = recommendModel