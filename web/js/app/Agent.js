define(['skeleton'], function(sk) {
    var Agent = sk.Model.extend({
        name: 'Agent',
        urlRoot: '/agent',
        idAttribute: 'id',
        configure: function(){
        },

        useAccount: function(account){
            this.account = account;
            this.set({'account': account});
            this.set('accountId', account.id);
            this.save();
        },
        getAccount: function(){
            return this.account;
        }
    });
    return Agent;
});