/**
 * CREATED DATE: 2019/1/28 13:27:45
 * author: mingmingbuzai
 * email: 847679250@qq.com
 */
class Response {
  constructor (message) {
    this.status = 0
    this.message = message
  }
  hasError (data=null) {
    return {
      status: 1,
      message: this.message || 'error',
      data
    }
  }
  hasData (data=null) {
    return {
      status: this.status,
      message: this.message || 'success',
      data
    }
  }
}

module.exports = Response