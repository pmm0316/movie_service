/**
 * CREATED DATE: 2019/1/28 11:19:16
 * author: mingmingbuzai
 * email: 847679250@qq.com
 */
var mongoose = require('mongoose')
var url = 'mongodb://localhost/movieServer'
mongoose.connect(url)
// 连接数据库
module.exports = mongoose