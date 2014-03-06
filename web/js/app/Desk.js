define(['Underscore', 'skeleton',
    './Conversations',
    './LogManager'],
function(_, sk,
         Conversations,
         LogManager) {
    var Desk = sk.Model.extend({
        name: 'Desk',
        idAttribute: 'id',
        configure: function(){
            this.latest = null;
            this.active = null;
            this.conversations = new Conversations();
            this.loaded = false;
        },
        use: function(agent){
            this.agent = agent;
            this.messager = agent.messager;
            this.conversations.agent = agent;
            this.listenTo(this.messager, 'message', this.onMessage, this);
        },

        load: function(){
            var desk = this;
            this.conversations.fetch({
                success: function(collection, response, options){
                    _.each(collection.models, function(item){
                        item.use(desk.agent);
                    });
                    desk.loaded = true;
//                    desk.conversations.trigger('list', collection.models);
                },
                error: function(collection, response, options){
                    console.error(response);
                    alert('fail to fetch conversation from backend');
                }
            });
        },
        unload: function(){
            this.conversations.reset();
            this.loaded = false;
        },
        getConversation: function(thread, jid, outbound){
            var current = null;
            var matched = false;
            var created = false;

            //check if the incoming msg belongs to the latest conversation
            if(this.latest){
                matched = this.latest.match(thread, jid);
            }

            if(matched){
                current = this.latest;
            }
            else{

                //check if the incoming msg is existed in the conversation collection, or needs to be created
                current = this.conversations.getConversation(thread, jid);
                if(!current){
                    current = this.conversations.newConversation(thread, jid);
                    created = true;
                }
            }

            if(outbound){
                this.trigger('cvs-outbound', this.latest, current, matched, created);
            }
            else{
                this.trigger('cvs-inbound', this.latest, current, matched, created);
                this.latest = current;
            }

            return current;
        },
        useConversation: function(cvs){
            console.debug('use conversation - ' + cvs.id + ' - ' + cvs.get('jid'));
            var active = this.active ? this.active : null;
            this.trigger('cvs-activated', active, cvs);
            if(active!==cvs){
                this.trigger('cvs-changed', active, cvs);
                this.active = cvs;
            }
        },
        onMessage: function(msg){
            var conversation = this.getConversation(msg.thread, msg.fromJid);
            this.trigger('message', conversation, msg);
            conversation.receive(msg);
        },
        emptyFn: function () {}
    });
    return Desk;
});