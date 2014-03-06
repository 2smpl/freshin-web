define(['skeleton'], function(sk) {
    var Log = sk.Model.extend({
        name: 'Log',
        urlRoot: '/log',
        idAttribute: 'id',
        configure: function(){

        }
    });
    return Log;
});