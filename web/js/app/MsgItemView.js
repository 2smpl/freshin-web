define(['jQuery', 'skeleton', './AgentHolder'],
function($, sk, AgentHolder) {
    var MsgItemView = sk.View.extend({
        templateName: 'msg-item',
        tagName: 'div',
        className: 'row-fluid',
        events: {
        },
        configure: function() {
        },
        show: function(){
            this.$el.slideDown();
        },
        hide: function(){
            this.$el.hide();
        },
        afterRender: function(){
        }

    });
    return MsgItemView;
});