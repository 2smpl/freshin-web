define(['Underscore', 'jQuery', 'skeleton', 'config', './AgentHolder',
    './CvsEntriesView',
    './LogManager'],
function(_, $, sk, config, AgentHolder,
    CvsEntriesView,
    LogManager
    ) {
    var DeskView = sk.View.extend({
        vid: 'desk',
        templateName: 'desk',
        prerendered: true,
        events: {
        },
        configure: function() {
            var conversations = this.model.conversations;
            var cvsEntriesView = new CvsEntriesView({
                model: conversations
            });
            this.addChild(cvsEntriesView);

            this.listenTo(this.model, 'cvs-activated', this.onCvsActivated, this);
        },
        onCvsActivated: function (last, current) {
            current.show();
            this.getParent().activate('desk');
        },
        emptyFn: function(){}
    });

    return DeskView;
});

