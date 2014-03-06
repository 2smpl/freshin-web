define(['skeleton'], function(sk) {
    var Msg = sk.Model.extend({
        name: 'Msg',
        idAttribute: 'id',
        configure: function(){
        }
    });
    return Msg;
});