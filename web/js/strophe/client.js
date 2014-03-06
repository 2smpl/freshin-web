define(['Strophe', 'jQuery', 'Underscore', 'Backbone'], function(Strophe, $, _, bb) {

    var Plugin = {
        id: 'client',

        Events: {
            xmlinput: 'xmpp:client:xmlinput',
            xmloutput: 'xmpp:client:xmloutput',
            rawinput: 'xmpp:client:rawinput',
            rawoutput: 'xmpp:client:rawoutput',
            status: 'xmpp:client:status',
            connected: 'xmpp:client:status:connected',
            disconnected: 'xmpp:client:status:disconnected',
            online: 'xmpp:client:status:online',
            offline: 'xmpp:client:status:offline'
        },

        configDefaults: {},

        init: function(connection){
            this.connection = connection;
            this.config = _.clone(this.configDefaults);
            _.extend(this, Backbone.Events);

            var me = this;
            this.connection.rawInput = function(msg){me.trigger(me.Events.rawinput, msg);};
            this.connection.rawOutput = function(msg){me.trigger(me.Events.rawoutput, msg);};
            this.connection.xmlInput = function(msg){me.trigger(me.Events.xmlinput, msg);};
            this.connection.xmlOutput = function(msg){me.trigger(me.Events.xmloutput, msg);};
        },

        statusChanged: function(status){
            this.trigger(this.Events.status, status);
            if (status === Strophe.Status.CONNECTED) {
                this.trigger(this.Events.connected);
                this.trigger(this.Events.online);
            } else if (status === Strophe.Status.DISCONNECTED) {
                this.trigger(this.Events.disconnected);
                this.trigger(this.Events.offline);
            }
        },

        reportPresence: function(presence){
            var available = presence.available;
            var attrs = available ? {} : {type: 'unavailable'};
            var pres = $pres(attrs);
            if(available) {
                pres.c('show').t(presence.show || 'chat').up();
                if(presence.status){
                    pres.c('status').t(presence.status).up();
                }
            }
            this.connection.send(pres.tree());
        },

        setConfig: function(key, value){
            if(_.isObject(key)){
                _.extend(this.config, this.key);
            }
            else{
                this.config[key] = value;
            }
        }
    };


    Strophe.addConnectionPlugin(Plugin.id, Plugin);

    return null;
});