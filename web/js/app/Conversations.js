define(['skeleton', 'config', 'LocalStorage', './Conversation'],
function(sk, config, LocalStorage, Conversation) {

    var Conversations = sk.Collection.extend({
        model: Conversation,
        url: 'conversations',
        name: 'Conversations',
        localStorage: new LocalStorage("liao.cvs"),
        configure: function(){
        },
        use: function(agent){
            this.agent = agent;
        },
        getConversation: function(thread, jid){
            console.debug('get conversation');
            var cvs = null;
            if(thread){
                if(thread.id && thread.parent){
                    cvs = this.findWhere({
                        rootId: thread.parent,
                        subId: thread.id
                    });
                }
                else if(thread.id){
                    cvs = this.findWhere({
                        rootId: thread.id
                    });
                    if(cvs==null){
                        cvs = this.findWhere({
                            subId: thread.id
                        });
                    }
                }
                else{
                    console.error('message thread is empty');
                }
            }
            else{
                cvs = this.findWhere({
                    jid: jid
                });
            }
            return cvs;
        },
        newConversation: function(thread, jid){
            console.error('new conversation');
            var props = {
                id: ''+new Date().getTime(),
                jid: jid
            };
            if(thread){
                if(thread.id && thread.parent){
                    props.rootId = thread.parent;
                    props.subId = thread.id;
                }
                else if(thread.id){
                    props.rootId = thread.id;
                }
                else{
                    console.error('message thread is empty');
                }
            }

            var cvs = new Conversation(props);
            cvs.use(this.agent);
            this.addConversation(cvs);
            return cvs;
        },
        addConversation: function(item){
            console.debug('add conversation ' + JSON.stringify(item));
            this.add(item);
            item.save();
        },
        removeConversation: function(models){
            console.debug('remove conversations');
            this.remove(models);
        }
    });
    return Conversations;
});