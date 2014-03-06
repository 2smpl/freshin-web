define(['jQuery', 'skeleton',
    './AgentHolder',
    './MsgEdit', './MsgEditView'
    ],
function($, sk, AgentHolder, MsgEdit, MsgEditView) {
    var ConversationView = sk.View.extend({
        vid: 'conversation',
        templateName: 'conversation',
        events: {
        },
        configure: function(){
//            var agent = AgentHolder.get();
//            var account = agent.getAccount();
//            var messager = account.messager;

            var editMsg = this.model.getChild('edit');
            var editMsgView = new MsgEditView({
                model: editMsg
            });
            this.addChild(editMsgView);
        },
        afterRender: function() {
        }
    });

    return ConversationView;
});