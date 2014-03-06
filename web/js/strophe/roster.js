define(['Strophe', 'jQuery', 'Underscore', 'Backbone'], function(Strophe, $, _, bb) {

    var Contact = function () {
        this.name = '';
        this.resources = {};
        this.subscription = 'none';
        this.ask = '';
        this.groups = [];
    }

    Contact.prototype = {};

    var Plugin = {
        id: 'roster',

        Events: {
            load: 'xmpp:roster:load',
            change: 'xmpp:roster:change',
            add: 'xmpp:roster:add',
            remove: 'xmpp:roster:remove',
            update: 'xmpp:roster:update',
            subscribe: 'xmpp:roster:subscribe',
            unsubscribe: 'xmpp:roster:unsubscribe',
            subscribed: 'xmpp:roster:subscribed',
            unsubscribed: 'xmpp:roster:unsubscribed',
            presence: 'xmpp:roster:presence'

        },

        init: function(connection){
            this.connection = connection;
            /*
             * TODO: Strophe.addNamespace('ROSTERX', 'http://jabber.org/protocol/rosterx');
             * use NS: ROSTER which IS already added in Strophe
             * ROSTER:  'jabber:iq:roster'
             */
            _.extend(this, Backbone.Events);
        },

        statusChanged: function(status){
            if (status === Strophe.Status.CONNECTED) {
                this.rosterChangedHandler = this.connection.addHandler(this.onRosterChanged.bind(this), null, 'iq', 'set');
//                this.onSubscribeHandler = this.connection.addHandler(this.onSubscribe.bind(this), null, 'presence', 'subscribe');
//                this.onUnsubscribeHandler = this.connection.addHandler(this.onUnsubscribe.bind(this), null, 'presence', 'unsubscribe');
//                this.onSubscribedHandler = this.connection.addHandler(this.onSubscribed.bind(this), null, 'presence', 'subscribed');
//                this.onUnsubscribedHandler = this.connection.addHandler(this.onUnsubscribed.bind(this), null, 'presence', 'unsubscribed');
                this.presenceHandler = this.connection.addHandler(this.onPresence.bind(this), Strophe.NS.CLIENT, 'presence');

            } else if (status === Strophe.Status.DISCONNECTED) {
                this.connection.deleteHandler(this.rosterChangedHandler);
//                this.connection.deleteHandler(this.onSubscribeHandler);
//                this.connection.deleteHandler(this.onUnsubscribeHandler);
//                this.connection.deleteHandler(this.onSubscribedHandler);
//                this.connection.deleteHandler(this.onUnsubscribedHandler);
                this.connection.deleteHandler(this.presenceHandler);
            }
        },

        load: function(){
            var me = this;
            var iq = $iq({type: 'get'}).c('query', {xmlns: Strophe.NS.ROSTER});

            this.contacts = {};
            this.connection.sendIQ(iq, function (iq) {
                $(iq).find('item').each(function () {
                    // build a new contact and add it to the roster
                    var contact = new Contact();
                    contact.jid = $(this).attr('jid');
                    contact.name = $(this).attr('name') || '';
                    contact.subscription = $(this).attr('subscription') || 'none';
                    contact.ask = $(this).attr('ask') || '';
                    $(this).find('group').each(function () {
                        contact.groups.push($(this).text());
                    });
                    me.contacts[contact.jid] = contact;
                });

                //Notify client that roster is loaded
                me.trigger(me.Events.load, me.contacts);
            });
        },

        /**
         * Ask Server to add a contact to roster
         * @param contact object with jid, name and groups (group name array)
         * @param success callback function ref on success, it is with parameter of iq stanza element
         * @param error callback function ref on failure, it is with parameter of iq stanza element
         * @param timeout timeout milliseconds, if timeout, error callback will be triggered
         */
        add: function(contact, success, error, timeout){
            var iq = $iq({type: 'set'})
                .c('query', {xmlns: Strophe.NS.ROSTER})
                .c('item', {name: contact.name || '', jid: contact.jid});
            if (contact.groups && contact.groups.length > 0) {
                _.each(contact.groups, function (group) {
                    iq.c('group').t(group).up();
                });
            }
            var me = this;
            this.connection.sendIQ(iq, success, error, timeout);
        },

        /**
         * Ask Server to remove a contact by jid
         * @param jid
         * @param success callback function ref on success, it is with parameter of iq stanza element
         * @param error callback function ref on failure, it is with parameter of iq stanza element
         * @param timeout timeout milliseconds, if timeout, error callback will be triggered
         */
        remove: function(jid, success, error, timeout){
            var iq = $iq({type: 'set'})
                .c('query', {xmlns: Strophe.NS.ROSTER})
                .c('item', {jid: jid, subscription: 'remove'});
            var me = this;
            this.connection.sendIQ(iq, success, error, timeout);
        },

        /**
         * Ask Server to update a contact's information
         * @param contact object with jid, name and groups (group name array)
         * @param success callback function ref on success, it is with parameter of iq stanza element
         * @param error callback function ref on failure, it is with parameter of iq stanza element
         * @param timeout timeout milliseconds, if timeout, error callback will be triggered
         */
        update: function(contact, success, error, timeout){
            var iq = $iq({type: 'set'})
                .c('query', {xmlns: Strophe.NS.ROSTER})
                .c('item', {name: contact.name || '', jid: contact.jid});
            if (contact.groups && contact.groups.length > 0) {
                _.each(contact.groups, function (group) {
                    iq.c('group').t(group).up();
                });
            }
            var me = this;
            this.connection.sendIQ(iq, success, error, timeout);
        },

        /**
         * Ask server to subscribe a contact's presence
         * @param jid
         */
        requestSubscription: function (jid) {
            var presence = $pres({to: jid, type: 'subscribe'});
            this.connection.send(presence);
        },

        /**
         * Ask server to unsubscricbe a contact's presence
         * @param jid
         */
        requestUnsubscription: function (jid) {
            var presence = $pres({to: jid, type: 'unsubscribe'});
            this.connection.send(presence);
        },

        approveSubscription: function(jid) {
            var presence = $pres({to: jid, type: 'subscribed'});
            this.connection.send(presence);
        },

        rejectSubscription: function(jid) {
            var presence = $pres({to: jid, type: 'unsubscribed'});
            this.connection.send(presence);
        },

        /**
         * Listen to Server 's notification of roster changes (add, remove and update)
         * @private
         * @param iq
         */
        onRosterChanged: function(iq){
            //TODO
            console.log('roster changed');

            var me = this;
            var item = $(iq).find('item');
            var jid = item.attr('jid');
            var subscription = item.attr('subscription') || '';
            var ask = item.attr('ask') || '';

            if (subscription === 'remove') {
                // removing contact from roster
                console.log('on roster item removed');
                try{
                    me.trigger(me.Events.change, jid, 'remove');
                    me.trigger(me.Events.remove, jid);
                }
                catch(error){
                    console.error(error);
                }
            } else if (subscription === 'none') {
                // adding contact to roster
                var contact = new Contact();
                contact.jid = jid;
                contact.name = item.attr('name') || '';
                contact.subscription = subscription;
                contact.ask = ask;
                item.find('group').each(function () {
                    contact.groups.push($(this).text());
                });
                console.log('on roster item added');
                try{
                    me.trigger(me.Events.change, jid, 'add');
                    me.trigger(me.Events.add, contact);
                }
                catch(error){
                    console.error(error);
                }
            } else {
                // modifying contact on roster
                var contact = new Contact();
                contact.jid = jid;
                contact.name = item.attr('name') || null; //null means keeping old value
                contact.subscription = subscription || null; //null means keeping old value
                contact.ask = item.attr('ask') || null; //null means keeping old value
                contact.groups = [];
                item.find('group').each(function () {
                    contact.groups.push($(this).text());
                });
                console.log('on roster item updated');
                try{
                    me.trigger(me.Events.change, jid, 'update');
                    me.trigger(me.Events.update, contact);
                }
                catch(error){
                    console.error(error);
                }
            }

            // acknowledge receipt
            this.connection.send($iq({type: "result", id: $(iq).attr('id')}));
            return true;
        },

        /**
         * As a presence event dispatcher, to listen to Server's all presence events
         * @private
         * @param presence the xml element of presence from the server
         */
        onPresence: function(presence){
            console.error('a new presence comes'); //TODO DEBUG
            var p = $(presence);
            var to = p.attr('to');
            var from = p.attr('from');
            var type = p.attr('type') || 'available';
            var e = {
                to: to,
                from: from
            };

            if(type === 'available'){
                e.available = true;
                e.show = p.find('show').text() || 'chat';

                var status = p.find('status').text();
                status || status==='' ? e.status = status : null;
                return this.onPresenceStatus(e);
            }
            else if(type === 'unavailable'){
                e.available = false;
                return this.onPresenceStatus(e);
            }
            else if(type === 'subscribe'){
                return this.onSubscribe(e);
            }
            else if(type === 'unsubscribe'){
                return this.onUnsubscribe(e);
            }
            else if(type === 'subscribed'){
                return this.onSubscribed(e);
            }
            else if(type === 'unsubscribed'){
                return this.onUnsubscribed(e);
            }
            else{
                console.error('received presence with unknown type: ' + type);//TODO: handle error type
                return true;
            }
            return true;
        },

        /**
         * Handle the incoming presence status events (available or unavailable)
         * @private
         * @param e the event object which wrap properties: online, to, from, show and status
         */
        onPresenceStatus: function(e){
            //TODO
            console.log('the presence of ' + e.from + ' is changed to ' + (e.available?'available':'unavailable') + ' for ' + e.to);
            try{
                e.fromJid = Strophe.getBareJidFromJid(e.from);
                e.fromResource = Strophe.getResourceFromJid(e.from);
                this.trigger(this.Events.presence, e);
            }
            catch(error){
                console.error(error);
            }
            return true;
        },

        /**
         * Listen and handle to the application of a presence subscription from server
         * @private
         * @param e the event object which wrap properties: to, from
         */
        onSubscribe: function(e){
            //TODO
            console.log('the presence subscription of ' + e.to + ' is requested by ' + e.from);
            try{
                this.trigger(this.Events.subscribe, e);
            }
            catch(error){
                console.error(error);
            }

            return true;
        },

        /**
         * Listen and handle to the application of a presence unsubscription from server
         * @private
         * @param e the event object which wrap properties: to, from
         */
        onUnsubscribe: function(e){
            //TODO
            console.log('the presence unsubscription of ' + e.to + ' is requested by ' + e.from);
            try{
                this.trigger(this.Events.unsubscribe, e);
            }
            catch(error){
                console.error(error);
            }
            return true;
        },

        /**
         * Listen and handle the receipt pf a presence subscription from server
         * @private
         * @param e the event object which wrap properties: to, from
         */
        onSubscribed: function(e){
            //TODO
            console.log('the presence subscription of ' + e.to + ' is approved by ' + e.from);
            try{
                this.trigger(this.Events.subscribed, e);
            }
            catch(error){
                console.error(error);
            }

            return true;
        },

        /**
         * Listen and handle the receipt pf a presence unsubscription from server
         * @private
         * @param e the event object which wrap properties: to, from
         */
        onUnsubscribed: function(e){
            //TODO
            console.log('the presence unsubscription of ' + e.to + ' is approved by ' + e.from);
            try{
                this.trigger(this.Events.unsubscribed, e);
            }
            catch(error){
                console.error(error);
            }
            return true;
        },

        emptyFn: function(){}
    };

    Strophe.addConnectionPlugin(Plugin.id, Plugin);

    return null;
});