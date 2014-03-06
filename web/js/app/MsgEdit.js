define(['skeleton'], function(sk) {
    var MsgEdit = sk.Model.extend({
        name: 'MsgEdit',
        idAttribute: 'id',
        configure: function(){
        }
    });
    return MsgEdit;
});