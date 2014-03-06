define(['jQuery', 'skeleton',
    './AgentHolder',
    './CvsChatView'
    ],
function($, sk,
    AgentHolder,
    CvsChatView) {
    var WorkbenchView = sk.View.extend({
        vid: 'workbench',
        templateName: 'workbench',
        events: {
        },
        configure: function(){
            var desk = AgentHolder.get().getAccount().desk;
            this.listenTo(desk, 'cvs-activated', this.onCvsActivated, this);
        },
        onCvsActivated: function(last, current){
            console.debug('cvs is activated - ' + current.get('jid'));
            var currentSubView = this.getChildView(current);
            var lastChildView = null;
            if(this.active && this.active.id!=current.id){
                lastChildView = this.getChildView(this.active);
                this.hideChildView(lastChildView);
            }
            this.showChildView(currentSubView);
            this.active = currentSubView.model;
        },
        getChildView: function(cvs){
            var vid = this.getChildViewId(cvs);
            var cvsTabView = this.getChild(vid);
            if(!cvsTabView){
                cvsTabView = this.addChildView(cvs);
            }
            return cvsTabView;
        },
        addChildView: function(cvs){
            var vid = this.getChildViewId(cvs);
            var cvsView = new CvsChatView({
                vid: vid,
                model: cvs
            });
            this.addChild(cvsView);

            cvsView.$el.attr('data-view-id', vid);
            this.$('div.workbench').prepend(cvsView.el);

            return cvsView;
        },
        showChildView: function(childView){
            if(!childView.allRendered){
                childView.afterAllRendered(400);
            }
            childView.setVisible(true);
            childView.show();
        },
        hideChildView: function(childView){
            childView.hide();
        },
        getChildViewId: function(cvs){
            return 'view-' + cvs.id;
        },
        afterRender: function() {
        }
    });

    return WorkbenchView;
});