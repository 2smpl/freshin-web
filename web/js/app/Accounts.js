define(['skeleton', 'LocalStorage', './Account'], function(sk, LocalStorage, Account) {
    var Accounts = sk.Collection.extend({
        model: Account,
        name: 'Accounts',
        localStorage: new LocalStorage("liao.account")
    });
    return Accounts;
});