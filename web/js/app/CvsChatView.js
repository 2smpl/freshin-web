define(['jQuery', 'skeleton',
    './AgentHolder',
    './MsgList', './MsgListView',
    './MsgEdit', './MsgEditView'
    ],
function($, sk, AgentHolder, MsgList, MsgListView, MsgEdit, MsgEditView) {
    var CvsChatView = sk.View.extend({
        templateName: 'cvs-chat',
        className: 'cvs',
        events: {
        },
        configure: function(){
//            var msgList = new MsgList();
//            this.model.addChild('list', msgList);
            var msgList = this.model.msgList;
            var msgListView = new MsgListView({
                model: msgList
            });
            this.addChild(msgListView);

            var msgEdit = new MsgEdit();
            this.model.addChild('edit', msgEdit);
            var msgEditView = new MsgEditView({
                model: msgEdit
            });
            this.addChild(msgEditView);
        },
        setVisible: function(visible){
            this.$el.css('visibility', visible ? 'visible' : 'hidden');
        },
        afterAllRendered: function(delay) {
            this.getChild('msg-list').showTheLatest(delay);
            this.allRendered = true;
        }
    });

    return CvsChatView;
});