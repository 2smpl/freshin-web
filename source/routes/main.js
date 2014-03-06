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

    app.get('/thing/:id/:action', function(req, res) {
        var thingId = req.params.id;
        var uid = req.user.id;
        var action = req.params.action;
        logger.debug(util.format('User [%s] %ss thing [%s]', uid, action, thingId));

        res.json(200, {});
    });

};