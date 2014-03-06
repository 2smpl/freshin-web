define(['skeleton', 'config', 'LocalStorage', './Conversation'],
function(sk, config, LocalStorage, Conversation) {

    var Workbench = sk.Collection.extend({
        model: Conversation,
        localStorage: new LocalStorage("liao.cvs-tabs"),
        configure: function(){

        },
        emptyFn: function(){}
    });
    return Workbench;
});