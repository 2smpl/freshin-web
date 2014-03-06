define(['Underscore', 'skeleton',
    './Contacts',
    './LogManager'],
function(_, sk,
         Contacts,
         LogManager) {
    var Roster = sk.Model.extend({
        name: 'Roster',
        urlRoot: '/roster',
        idAttribute: 'id',
        configure: function(){
            this.contacts = new Contacts();
            this.eq = []; //event queue
            this.es = {}; //event stack
            this.loaded = false;
        },
        use: function(agent){
            var delegate = agent.connection.roster
            this.agent = agent;
            this.delegate = delegate;
            var Events = delegate.Events;
            delegate.on(Events.load, this.onLoad, this);
            delegate.on(Events.presence, this.onUpdatePresence, this);
            delegate.on(Events.add, this.onAdd, this);
            delegate.on(Events.remove, this.onRemove, this);
            delegate.on(Events.update, this.onUpdate, this);

            delegate.on(Events.subscribe, this.onSubscriptionRequested, this);
            delegate.on(Events.unsubscribe, this.onUnsubscriptionRequested, this);
            delegate.on(Events.subscribed, this.onSubscriptionApproved, this);
            delegate.on(Events.unsubscribed, this.onUnsubscriptionApproved, this);

        },
        load: function(){
            this.delegate.load();
        },
        unload: function(){
            this.contacts.reset();
            this.loaded = false;
        },
        add: function(contact){
            var jid = contact.jid;
            var toContact = this.contacts.get(jid);
            if(toContact){
                var sub = toContact.get('subscription');
                if(sub=='both' || sub=='to' ){
                    alert(jid + ' has been subscribed');
                    //TODO: alert
                }
                else if(sub=='from' || sub=='none'){
                    this.delegate.requestSubscription(jid);
                }
                else{
                    console.error('contact ' + jid + ' in roster has illegal subscription value: ' + sub);
                }
            }
            else{
                this.delegate.add(contact);
                this.delegate.requestSubscription(jid);
            }
        },
        onAdd: function(contact){
            LogManager.info(contact.jid + ' is added to roster');
            console.log(contact);
            var existed = this.contacts.get(contact.jid);
            if(existed){
                console.log(contact.jid + ' is existed in roster when it will be added to');
                LogManager.info(contact.jid + ' is updated'); //TODO: update what properties
                this.contacts.updateContact(contact);
            }
            else{
                this.contacts.addContact(contact);
            }
        },
        remove: function(jid){
            var toContact = this.contacts.get(jid);
            if(toContact){
                var sub = toContact.get('subscription');
                if(sub=='both' || sub=='to' ){
                    this.delegate.requestUnsubscription(jid);
                    this.delegate.remove(jid);
                }
                else if(sub=='none'){
                    this.delegate.remove(jid);
                }
                else if(sub=='from'){
                    //TODO: check what should do in this case
//                    this.delegate.requestUnsubscription(jid);
//                    this.delegate.rejectSubscription(jid);
                    this.delegate.remove(jid);
                }
                else{
                    console.error('contact ' + jid + ' in roster has illegal subscription value: ' + sub);
                }
            }
            else{
                //TODO: not in roster
                this.delegate.remove(jid);
            }
        },
        onRemove: function(jid){
            var existed = this.contacts.get(jid);
            if(existed){
                this.contacts.removeContact(jid);
                LogManager.info(jid + ' is removed from roster');
            }
        },
        onUpdate: function(contact){
            LogManager.info(contact.jid + ' is updated to roster');
            console.log(contact);
            var existed = this.contacts.get(contact.jid);
            if(existed){
                LogManager.info(contact.jid + ' is updated'); //TODO: update what properties
                this.contacts.updateContact(contact);
            }
            else{
                console.log(contact.jid + ' is not existed in roster when it will be updated');
                this.contacts.addContact(contact);
            }
        },
        onLoad: function(contacts){
            var me = this;
            var toRemove = [];

            if(this.contacts.length==0){
                var newContacts = [];
                var newContact = null;
                _.each(contacts, function(item){
                    newContact = me.contacts.newContact(item);
                    newContacts.push(newContact);
                    me.contacts.add(newContact, {silent: true});
                });
                this.contacts.trigger('load', newContacts);
                this.trigger('load', newContacts); //TODO just add it here too
                this.afterLoad();
                return;
            }

            _.each(this.contacts.models, function(item){
                if(!contacts[item.get('jid')]){
                    toRemove.push(item);
                }
            });

            _.each(contacts, function(item){
                var contact = me.contacts.get(item.jid);
                if(!contact){
                    me.contacts.addContact(item);
                }
                else{
                    me.contacts.updateContact(item);
                }
                LogManager.debug(item.jid + ' - ' + item.name);
            });
            if(toRemove.length>0){
                me.contacts.removeContact(toRemove);
            }
            this.afterLoad();
        },
        afterLoad: function(){
            this.loaded = true;
            while(this.eq.length>0){
                var e = this.eq.shift();
                this.onUpdatePresence(e);
            }
        },
        onUpdatePresence: function(e){
            if(!this.loaded){
                this.eq.push(e);
                return;
            }
            var contact = this.contacts.get(e.fromJid);
            if(contact){
                contact.set('available', e.available);
                var show = e.available ? e.show : 'offline';
                contact.set('show', show);
                if(e.available){
                    if(e.status){
                        contact.set('message', e.status);
                    }
                }
            }
            else{
                console.warn(e.fromJid + ' is not existed in roster');
            }
        },
        requestSubscription: function (jid) {
            this.delegate.requestSubscription(jid);
        },
        requestUnsubscription: function (jid) {
            this.delegate.requestUnsubscription(jid);
        },
        approveSubscription: function(jid) {
            this.delegate.approveSubscription(jid);
        },
        rejectSubscription: function(jid) {
            this.delegate.rejectSubscription(jid);
        },
        onSubscriptionRequested: function (e) {
            LogManager.info('' + e.from + ' request a subscription to you');
            this.trigger('subscribe', e);
        },
        onUnsubscriptionRequested: function (e) {
            LogManager.info('' + e.from + ' request a unsubscription to you');
            this.trigger('unsubscribe', e);
        },
        onSubscriptionApproved: function (e) {
            LogManager.info('' + e.from + ' approve a subscription from you.');
            this.trigger('subscribed', e);
        },
        onUnsubscriptionApproved: function (e) {
            LogManager.info('' + e.from + ' approve a unsubscription from you.');
            this.trigger('unsubscribed', e);
        }
    });
    return Roster;
});