define(['Strophe', 'jQuery', 'Underscore', 'Backbone'], function(Strophe, $, _, bb) {

    var Plugin = {
        id: 'messaging',

        Events: {
            message: 'xmpp:messaging:message'
        },

        init: function(connection){
            this.connection = connection;
            /*
             * use NS: XHTML_IM & XHTML which are already added in Strophe
             */
            _.extend(this, Backbone.Events);
        },

        statusChanged: function(status){
            if (status === Strophe.Status.CONNECTED) {
                this.messageReceivedHandler = this.connection.addHandler(this.onMessageReceived.bind(this), null, 'message');
            } else if (status === Strophe.Status.DISCONNECTED) {
                this.connection.deleteHandler(this.messageReceivedHandler);
            }
        },

        // **send** sends a message. `body` is the plaintext contents whereas `html_body` is the html version.
        send: function (msg) {
            var stanza = $msg({to: msg.to});

            if(msg.type){
                stanza.attrs({type: msg.type});
            }

            if(msg.body) {
                stanza.c('body', {}, msg.body); //don't support multiple body elements as of now
            }

            if(msg.html_body) {
                stanza.c('html', {xmlns: Strophe.NS.XHTML_IM})
                    .c('body', {xmlns: Strophe.NS.XHTML})
                    .h(msg.html_body);
            }

            if(msg.thread && msg.thread.id){
                stanza.c('thread', {}, msg.thread.id);
            }

            console.debug('to - message - ' + msg.toString());
            this.connection.send(stanza.tree());
        },

        onMessageReceived: function(message){
            console.error('on - new message comes: ' + message.toString()); //TODO DEBUG
            var msg = $(message);
            var to = msg.attr('to');
            var from = msg.attr('from');
            var type = msg.attr('type');
            var e = {
                to: to,
                from: from,
                fromJid: Strophe.getBareJidFromJid(from),
                fromResource: Strophe.getResourceFromJid(from),
                type: type
            };

            //Get body info
            var body = msg.children('body').text();
            if (body === '') {
                console.debug('on - message - empty body');
                return true; // Typing notifications are not handled.
            }
            e.body = body;

            //Get html body info
            var html_body = $('html[xmlns="' + Strophe.NS.XHTML_IM + '"] > body', message);
            if (html_body.length > 0) {
                html_body = $('<div>').append(html_body.contents()).html();
            }
            else {
                html_body = null;
            }
            e.html_body = html_body;

            //Get thread info
            var thread = null;
            var t = msg.find('thread');
            if(t.length>0){
                thread = {};
                thread.id = t.text();
                thread.parent = t.attr('parent');
            }
            e.thread = thread;

            this.trigger(this.Events.message, e);
            return true;
        },

        emptyFn: function(){}
    };


    Strophe.addConnectionPlugin(Plugin.id, Plugin);

    return null;
});