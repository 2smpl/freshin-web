var logger = require('../commons/logging').logger;
var util = require('util');

module.exports = function(app) {
    var mode = app.get('env') || 'development';
    var asseton = require('../middlewares/asseton')(mode);

    var indexPage = function(req, res, next) {
        asseton(req, res);
        var input = {};
        res.render('layout', input);
    };
    app.get('/',      indexPage);
    app.get('/roster',      indexPage);
    app.get('/desk',      indexPage);

};