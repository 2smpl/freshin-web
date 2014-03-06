var context = require('../commons/context');
var requestIdGen = require('../commons/id').get('ComingRequest');

/**
 * The module's client must not change the context outside.
 * @param req
 * @param res
 * @param next
 */
var contexton = function (req, res, next) {
    context.userId = null;//req.session.user ? req.session.user.id : null;
    context.userAgent = req.headers['user-agent'];
    context.userResolution = req.cookies.uresolution;
    context.requestId = requestIdGen.next().toId();
    context.sessionId = null;//req.sessionID;
    context.startTime = new Date();

    next();
};

module.exports = contexton;