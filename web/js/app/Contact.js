define(['jQuery', 'skeleton'], function($, sk) {
    var Contact = sk.Model.extend({
        name: 'Contact',
        urlRoot: '/contact',
        idAttribute: 'jid',
        configure: function(){
        }
    });
    return Contact;
});