define(['jQuery', 'skeleton',
    './AgentHolder',
    './LogManager'],
function($, sk,
    AgentHolder,
    LogManager) {
    var MsgEditView = sk.View.extend({
        vid: 'msg-edit',
        templateName: 'msg-edit',
        events: {
            "change #msg": "toEdit",
            "keydown #msg": "toKeydown",
            "click #send": "toSend"
        },
        configure: function() {
            this.jid = this.model.getParent().get('jid');
//            this.listenTo(this.model, 'change:subscription', this.onSubscriptionChanged, this);
        },
        toEdit: function(e){
            var msg = this.$('#msg').val();
            this.model.set('body', msg);
            console.debug('to - edit message - ' + msg);
        },
        toSend: function(e){
            var messager = AgentHolder.get().getAccount().messager;
            var cvs = this.model.getParent();
            var body = $.trim(this.$('#msg').val());
            if(!body){
                return;
            }

            var thread = this.getThread(cvs);
            var msg = {
                type: 'chat',
                to: this.jid,
                body: body,
                thread: thread
            };

            console.log(msg);
            messager.send(msg);
            this.addToList(msg);
            this.$('#msg').val('');
        },
        toKeydown: function(e){
            if(e.keyCode==13){
                e.preventDefault();
                this.toSend();
            }
        },
        addToList: function(msg){
            var list = this.model.getParent().msgList;
            list.addSentMsg(msg);
        },
        //TODO: update thread to follow received messages when thread is changed
        getThread: function(cvs){
            if(this.thread){
                return this.thread;
            }
            var thread = null;
            var rootId = cvs.get('rootId');
            var subId = cvs.get('subId');
            if(rootId&&subId){
                thread = {
                    id: subId,
                    parent: rootId
                };
            }
            else if(rootId&&!subId){
                thread = {
                    id: rootId
                };
            }
            else if(!rootId&&subId){
                thread = {
                    id: subId
                };
            }
            else{
                thread = {};
            }
            this.thread = thread;
            return thread;
        },
        afterRender: function(){
        }

    });
    return MsgEditView;
});