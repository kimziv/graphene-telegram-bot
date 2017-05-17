"use strict";
let logger = require('../lib/log')
const getAuthInfo = require('../lib/getAuthInfo')
let globalVal = require('../lib/global')
module.exports = function () {
  this.on('login', (err, obj) => {
    err && logger.error(err)
    if (err!=null || err===true) {
      console.log("login error:"+err);
      return;
    }
    let text = obj.text
    let redirectUri = text.match(/\"(.+)\"/)[1] + '&fun=new&version=v2'
    let baseUrl = redirectUri.match(/(wx.+com)/)[1]
    globalVal.baseUrl = baseUrl
    logger.debug('debug:' + baseUrl)
    getAuthInfo(redirectUri, (err, obj) => {
      this.emit('getAuth', err, obj)
    })
  })
}
