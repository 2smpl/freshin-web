define(['skeleton', 'config', 'strophe',
    './Roster',
    './Messager',
    './Desk',
    './LogManager'],
function(sk, config, Strophe,
    Roster,
    Messager,
    Desk,
    LogManager) {

    var boshUrl = config.xmpp.boshUrl;
    var Shows = {
        chat: true,
        away: true,
        dnd: true,
        xa: true
    };

    var Account = sk.Model.extend({
        name: 'Account',
        urlRoot: '/account',
        idAttribute: 'id',
        configure: function(){
            this.ensureConnection();
        },
        initConnection: function(){
//            Strophe.log = function(level, msg){
//                if(LogLevel.DEBUG==level){
//                    console.debug(msg);
//                }
//                else if(LogLevel.INFO==level){
//                    console.info(msg);
//                }
//                else if(LogLevel.WARN==level){
//                    console.warn(msg);
//                }
//                else if(LogLevel.ERROR==level){
//                    console.error(msg);
//                }
//                else if(LogLevel.FATAL==level){
//                    console.error(msg);
//                }
//            };
            this.connection = new Strophe.Connection(boshUrl);
            this.client = this.connection.client;
            var client = this.client;
            client.on(client.Events.status, this.onConnectionStatus, this);
            client.on(client.Events.connected, this.onConnected, this);
            client.on(client.Events.disconnected, this.onDisconnected, this);
            client.on(client.Events.rawinput, function(msg){console.debug('RECV: ' + msg);});
            client.on(client.Events.rawoutput, function(msg){console.info('SENT: ' + msg);});

            this.roster = new Roster();
            this.roster.use(this);

            this.messager = new Messager();
            this.messager.use(this);

            this.desk = new Desk();
            this.desk.use(this);

            this.on('change:show', this.onShowChanged, this);
            this.on('change:message', this.onMessageChanged, this);

            var me = this;
            this.listenTo(this.roster, 'load', function(){
                me.desk.load();
            });
        },
        signin: function(){
            LogManager.info('to - sign in');
            this.doSignin(false);
        },
        online: function(){
            LogManager.info('to - online');
            this.doSignin(true);
        },
        doSignin: function(keep){
            this.set('keep', keep);
            var fullJid = this.getFullJid();
            var password = this.get('password');
            try{
                this.connection.connect(fullJid, password);
            }
            catch(e){
                console.error(e.message);
            }
            this.save();
        },
        signout: function(){
            LogManager.info('to - sign out');
            this.doSignout(false);
        },
        offline: function(){
            LogManager.info('to - offline');
            this.doSignout(true);
        },
        doSignout: function(keep){
            this.set('keep', keep);
            this.connection.disconnect();
            this.save();
        },
        getFullJid: function(){
            var jid = this.get('username');
            var resource = this.get('resource') || 'default';
            return jid+'/'+resource;
        },
        changeShow: function(showTo){
            var connected = this.get('connected');
            var showFrom = this.get('show');
            var status = this.get('message');

            showFrom = connected ? showFrom : 'offline';
            LogManager.info('to - change IM status: ' + showFrom + ' --> ' + showTo);

            if(connected){
                if(showTo=='offline'){
                    this.offline();
                }
                else if(showTo=='signout'){
                    this.signout();
                }
                else{
                    this.reportPresence(connected, showTo, status);
                    this.set('show', showTo);
                    this.save();
                }
            }
            else{
                if(showTo=='offline'){
                    console.warn('IM is disconnected, so no need to offline again');
                }
                else if(showTo=='signout'){
                    this.exit();
                    console.debug('IM is disconnected, so exit main');
                }
                else{
                    this.set('show', showTo);
                    this.save();
                    this.online();
                }
            }
        },
        changeMessage: function(msg){
            LogManager.info('to - change IM message: ' + msg);
            if(this.get('connected')){
                this.set('message', msg);
                this.updatePresence();
                this.save();
            }
            else{
                console.warn('IM is disconnected, so any actions is forbidden');
            }
        },
        updatePresence: function(){
            var available = this.get('connected');
            var show = this.get('show');
            var status = this.get('message');
            this.reportPresence(available, show, status);
        },
        reportPresence: function(available, show, status){
            var disconnected = !this.get('connected');
            if(disconnected){
                console.error('forbidden to report presence when disconnected');
                return;
            }
            var illegal = !Shows[show];
            if(illegal){
                console.error('illegal show value: ' + show);
                return;
            }

            var stanza = {available: available};
            show = available && show ? stanza.show = show : '';
            status = available && status ? stanza.status = status : '';

            LogManager.info('to - report presence: available=' + available + ', show=' + show + ', status=' + status);
            this.client.reportPresence(stanza);
        },
        ensureConnection: function(){
            if(!this.connection){
                this.initConnection();
            }
        },
        onConnectionStatus: function(status){
            this.set('status', status);
        },
        onConnected: function(){
            this.set('connected', true);
            this.updatePresence();
            this.roster.load();
//            this.desk.load();

            LogManager.debug('on - connected');
            this.trigger('connected');

            LogManager.debug('on - online');
            this.trigger('online');

            if(this.get('keep')){

            }
            else{
                this.enter();
            }
        },
        enter: function(){
            LogManager.debug('on - enter');
            this.trigger('enter');
        },
        onDisconnected: function(){
            this.set('connected', false);

            LogManager.debug('on - disconnected');
            this.trigger('disconnected');

            LogManager.debug('on - offline');
            this.trigger('offline');

            if(!this.get('keep')){
                this.exit();
            }
        },
        exit: function(){
            this.desk.unload();
            this.roster.unload();
            LogManager.debug('on - exit');
            this.set('keep', false);
            this.trigger('exit');
        },
        onShowChanged: function(model, value){
            console.debug('on - IM status is changed to ' + value);
        },
        onMessageChanged: function(model, value){
            console.debug('on - IM message is changed to ' + value);
        },
        emptyFn: function(){}
    });
    return Account;
});