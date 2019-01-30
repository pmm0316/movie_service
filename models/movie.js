/**
 * CREATED DATE: 2019/1/28 16:32:12
 * author: mingmingbuzai
 * email: 847679250@qq.com
 */
const mongoose = require('../common/db')

let movie = new mongoose.Schema({
  movieName: String,
  movieImg: String,
  movieVideo: String,
  movieDownload: String,
  movieTime: String,
  movieNumSuppose: Number,
  movieNumDownload: Number,
  movieMainPage: Boolean
})

let movieModel = mongoose.model('movie', movie)

module.exports = movieModel