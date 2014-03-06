define(['jQuery', 'Underscore', 'skeleton', 'strophe'],
function($, _, sk, Strophe) {

    var statusKeyMap = Strophe.Status;
    var statusValueMap = _.invert(statusKeyMap);

    var testContactList = [
        {
            jid: 'admin@localhost',
            name: 'Admin',
            groups: ['colleagues', 'friends']
        },
        {
            jid: 'henryleu@localhost',
            name: 'Hongli',
            groups: ['friends']
        },
        {
            jid: 'abc@localhost',
            name: 'abc',
            groups: ['strangers']
        }
    ];
    var testContacts = {};
    testContacts[testContactList[0].jid] = testContactList[0];
    testContacts[testContactList[1].jid] = testContactList[1];
    testContacts[testContactList[2].jid] = testContactList[2];

    var ConnecterView = sk.View.extend({
        vid: 'connecter',
        templateName: 'connecter',
        events: {
            "click .connecter #clearLog": "onClearLog",
            "click .connecter #connect": "onControlConnection",
            "click .connecter #send": "onSend",
            "click .connecter #load": "onLoad",
            "click .connecter #add": "onAdd",
            "click .connecter #remove": "onRemove",
            "click .connecter #update": "onUpdate",
            "click .connecter #subscribe": "onSubscribe",
            "click .connecter #unsubscribe": "onUnsubscribe",
            "click .connecter #link": "onLink",
            "click .connecter #unlink": "onUnlink"

        },
        configure: function(){
            var me = this;
            var BOSH_SERVICE = 'http://localhost:7070/http-bind/';

            this.connection = new Strophe.Connection(BOSH_SERVICE);
//            this.connection.rawInput = function(msg){me.log('RECV: ' + msg)};
//            this.connection.rawOutput = function(msg){me.log('SENT: ' + msg)};
//            this.connection.addHandler(this.onMessage, null, 'message', null, null,  null);

            this.client = this.connection.client;
            this.roster = this.connection.roster;

            this.client.on(this.client.Events.rawinput, function(msg){me.log('RECV: ' + msg)});
            this.client.on(this.client.Events.rawoutput, function(msg){me.log('SENT: ' + msg, true)});
            this.client.on(this.client.Events.status, this.onStatus, this);
            this.client.on(this.client.Events.online, this.online, this);
            this.client.on(this.client.Events.offline, this.offline, this);
            this.roster.on(this.roster.Events.load, this.onRosterLoaded, this);
            this.roster.on(this.roster.Events.change, function(jid, action){
                console.log(jid + ' is changed by '+action+' action');
            });

            this.roster.on(this.roster.Events.add, function(contact){
                console.log(contact.jid + ' is added to roster');
                console.log(contact);
            });
            this.roster.on(this.roster.Events.remove, function(jid){
                console.log(jid + ' is removed from roster');
            });
            this.roster.on(this.roster.Events.update, function(contact){
                console.log(contact.jid + ' is updated');
                console.log(contact);
            });
            this.roster.on(this.roster.Events.subscribe, this.onSubscriptionRequested, this);
            this.roster.on(this.roster.Events.unsubscribe, this.onUnsubscriptionRequested, this);
            this.roster.on(this.roster.Events.subscribed, this.onSubscriptionApproved, this);
            this.roster.on(this.roster.Events.unsubscribed, this.onUnsubscriptionApproved, this);
            this.roster.on(this.roster.Events.presence, this.onPresence, this);

            this.model.on('change:status', this.onStatusChanged, this);

        },
        onControlConnection: function(e){
            var me = this;
            var status = this.model.get('status');
            if(Strophe.Status.CONNECTED == status){
                me.connection.disconnect();
            }
            else{
                var jid = $('#jid').get(0).value;
                var pwd = $('#password').get(0).value;
                me.connection.connect(jid, pwd);
            }
        },
        onStatusChanged: function(model, status){
            var msg = String(statusValueMap[status]).toLowerCase();
            this.log('STATUS: ' + msg);
            console.log('STATUS: ' + msg);

            if (status == 'UNKNOWN') {
                $('#connect').val('connect').prop("disabled", false);
            } else if (status == Strophe.Status.CONNECTING) {
                $('#connect').val('connecting').prop("disabled", true);
            } else if (status == Strophe.Status.CONNFAIL) {
                $('#connect').val('connect').prop("disabled", false);
            } else if (status == Strophe.Status.DISCONNECTING) {
                $('#connect').val('disconnecting').prop("disabled", true);
            } else if (status == Strophe.Status.DISCONNECTED) {
                $('#connect').val('connect').prop("disabled", false);
            } else if (status == Strophe.Status.CONNECTED) {
                $('#connect').val('disconnect').prop("disabled", false);
            } else {
                $('#connect').val('connect').prop("disabled", false);
            }
        },
        onStatus: function (status) {
            this.model.set('status', status);
        },
        online: function () {
            this.client.sendPresence({online: true, show: 'chat', status: 'happy new year!' });
            this.roster.load();
        },
        offline: function () {
            console.warn('you go offline');
        },
        onLoad: function (e) {
            this.roster.load();
        },
        onAdd: function (e) {
            var jid = $('#jidTo').val();
            var contact = _.clone(testContacts[jid]);
            console.log(contact);
            this.roster.add(contact, function(iq){console.warn('roster add callback'+iq)});
        },
        onUpdate: function (e) {
            var jid = $('#jidTo').val();
            var contact = _.clone(testContacts[jid]);
            contact.name += + ' - updated';
            contact.groups.push('temps');
            console.log(contact);
            this.roster.update(contact, function(iq){console.warn('roster update callback'+iq)});
        },
        onRemove: function (e) {
            var jid = $('#jidTo').val();
            this.roster.remove(jid, function(iq){console.warn('roster remove callback'+iq)});
        },
        onRosterLoaded: function(contacts){
            console.log('roster is loaded');
            console.log(contacts);
        },
        onSubscribe: function (e) {
            var jid = $('#jidTo').val();
            this.roster.requestSubscription(jid);
        },
        onUnsubscribe: function (e) {
            var jid = $('#jidTo').val();
            this.roster.requestUnsubscription(jid);
        },
        onLink: function (e) {
            var jid = $('#jidTo').val();
            var contact = testContacts[jid];
            this.roster.add(contact);
            this.roster.requestSubscription(jid);
        },
        onUnlink: function (e) {
            var jid = 'admin@localhost';
            jid = $('#jidTo').val();
            this.roster.requestUnsubscription(jid);
            this.roster.remove(jid);
        },
        onSubscriptionRequested: function (e) {
            var ok = true; //window.confirm('' + from + ' request a subscription on you, agree?');
            console.warn('' + e.from + ' request a subscription on you, agree?');
            console.log(ok?'agree':'disagree');
            if(ok){
                this.roster.approveSubscription(e.from);
            }
        },
        onUnsubscriptionRequested: function (e) {
            var ok = true;//window.confirm('' + from + ' request a unsubscription on you, agree?');
            console.warn('' + e.from + ' request a unsubscription on you, agree?');
            console.warn(ok?'agree':'disagree');
            if(ok){
                this.roster.approveUnsubscription(e.from);
            }
        },
        onSubscriptionApproved: function (e) {
            console.warn('' + e.from + ' approve a subscription on you.');
        },
        onUnsubscriptionApproved: function (e) {
            console.warn('' + e.from + ' approve a unsubscription on you.');
        },

        onPresence: function(e){
            console.warn('presence handler')
            console.error(e);
        },

        onSend: function (e) {
            var $el = this.$('#msg');
            var msg = $el.val();
            this.log(msg);
            $el.val('');

            var stz = $msg({to: "admin@localhost", from: "henryleu@localhost", type: 'chat'});
            stz.cnode(Strophe.xmlElement('body', null, msg));
            alert(stz.toString());
            this.connection.send(stz.tree());
        },
        onMessage: function (msg) {
//            this.log(msg.toString());
            alert(msg);
        },
        onClearLog: function(e){
            $('#log').html('');
        },
        log: function(msg, output){
            var className = 'text-success'
            if(output){
                className = 'text-info'
                console.info(msg);
            }
            else {
                console.debug(msg);
            }
//            $('#log').append('<p class="' +className+'">'+msg+'</p>');//.append(document.createTextNode(msg));
//            $('#log').append('<div class="' +className+'">'+'</div>').append('<div></div>').append(document.createTextNode(msg));
        },
        afterRender: function(){
//            $('#connect').trigger('click');
        }
    });

    return ConnecterView;
});