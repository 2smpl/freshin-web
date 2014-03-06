var UserKv = require('../kvs/User');
var settings = require('../../settings');
var crypto = require('crypto');
var logger = require('../commons/logging').logger;

var generateUserToken = function(uid){
    var key = settings.secretKey;
    return crypto.createHash('sha1').update(String(uid)).update(key).digest('hex');
};
var UserService = {
    loadByUserToken: function(utoken, callback){
        UserKv.load(utoken, callback);
    },
    create: function(callback){
        var user = {};//new User();
        var uid = '01';//user.autoId();
        var utoken = generateUserToken(uid);
        user.utoken = utoken;
        user.stt = 'a';
        UserKv.save(user, callback);
    }
};
module.exports = UserService;