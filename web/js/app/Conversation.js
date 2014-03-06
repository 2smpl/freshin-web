define(['Underscore', 'skeleton', 'LocalStorage',
    './MsgList',
    './LogManager'],
function(_, sk, LocalStorage,
    MsgList,
    LogManager) {
    var Conversation = sk.Model.extend({
        name: 'Conversation',
        urlRoot: '/conversation',
        idAttribute: 'id',
        configure: function(){
            this.on('message', this.onMessage, this);
            this.loaded = false;
            this.msgList = new MsgList();
        },
        use: function(agent){
            this.agent = agent;
            this.desk = agent.desk;
            this.bindContact();
        },
        bindContact: function(){
            this.contact = this.agent.roster.contacts.get(this.get('jid'));
            console.error(this.get('jid'));
            console.log(this.contact);
            this.set('show', 'chat');
            this.listenTo(this.contact, 'change:show', this.onShowChanged, this);
        },
        load: function(){
            var msgs = this.msgList;
            var me = this;
            try{
                var username = this.agent.get('username');
                this.msgList.localStorage = new LocalStorage("liao.msg-"+username+'-'+this.get('jid'));
            }
            catch(e){
                console.error(e.message);
            }

            this.msgList.fetch({
                success: function(collection, response, options){
                    msgs.trigger('list', collection.models);
                    me.loaded = true;
                },
                error: function(collection, response, options){
                    console.error('fail to load conversation history messages');
                    alert('fail to fetch messages from backend');
                }
            });
        },
        receive: function(msg){
            this.trigger('message', msg);
        },
        activate: function(){
            if(!this.loaded){
                this.load();
            }
            this.desk.useConversation(this);
        },
        match: function(thread, jid){
            var matched = false;
            if(thread){
                if(thread.id && thread.parent){
                    matched = this.get('rootId')==thread.parent && this.get('subId')==thread.id;
                    if(!matched){
                        matched = this.get('rootId')==thread.id;
                    }
                }
                else if(thread.id){
                    matched = this.get('rootId')==thread.id;
                    if(!matched){
                        matched = this.get('subId')==thread.id;
                    }
                }
                else{
                    console.error('msg thread is empty');
                }
            }
            else{
                matched = this.get('jid')==jid;
            }
            return matched;
        },
        hide: function(){
            this.set('hidden', true);
        },
        show: function(){
            this.set('hidden', false);
        },
        onShowChanged: function(model, value, options){
            console.error('contact show changed: ' + value);
            this.set('show', value);
        },
        onMessage: function(msg){
            this.msgList.addReceivedMsg(msg);
        },
        emptyFn: function () {}
    });
    return Conversation;
});