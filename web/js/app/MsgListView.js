define(['jQuery', 'skeleton', './MsgItem', './MsgItemView'],
function($, sk, MsgItem, MsgItemView) {
    var MsgListView = sk.View.extend({
        vid: 'msg-list',
        templateName: 'msg-list',
        className: 'cvs-list',
        configure: function(){
            var me = this;
            this.listenTo(this.model, 'add', this.onItemAdded, this);
            this.listenTo(this.model, 'remove', this.onItemRemoved, this);
            this.listenTo(this.model, 'list', function(models) {
                console.log(models.length + ' messages are loaded');
                me.renderItems(models);
            });
        },
        onItemAdded: function(model, collection, options){
            console.debug('message from ' + model.get('from') + ' is added');
            this.showTheLatest();
            this.addItemView(model);
            this.showTheLatest(400);
        },
        onItemRemoved: function(model, collection, options){
            console.debug('message from ' + model.get('from') + ' is removed');
            this.removeItemView(model);
        },
        renderChildren: function() {
            this.renderItems(this.model.models);
        },
        renderItems: function(items) {
            var $el = this.$el.find('div.msg-list');
            var fragment = document.createDocumentFragment();
            var itemView = null;
            for(var index = 0; index<items.length; index++){
                itemView = this.newItemView(items[index]);
                fragment.appendChild(itemView.el);
            }
            $el.append(fragment);
        },
        newItemView: function(item, hidden) {
            var itemView = new MsgItemView({
                vid: item.id,
                model: item,
                hidden: hidden
            });
            this.addChild(itemView);
            return itemView;
        },
        addItemView: function(item) {
            var $el = this.$el.find('div.msg-list');
            var itemView = this.newItemView(item, true);
            $el.append(itemView.el);
            itemView.show();
        },
        removeItemView: function(item) {
            var vid = item.id;
            var itemView = this.getChild(vid);
            if(itemView){
                this.removeChild(vid);
                itemView.destroy();
            }
        },
        scrollToBottom: function(delay){
            var inner = this.$('.msg-list');
            var scrollHeight = inner[0].scrollHeight + 1000000;
            if(delay){
                inner.animate({scrollTop: ''+scrollHeight+"px"}, delay);
            }
            else{
                inner[0].scrollTop = scrollHeight;
            }

            console.error('scrollToBottom ' + scrollHeight + ' - ' + delay);
        },
        showTheLatest: function(delay){
            this.scrollToBottom(delay);
        },
        emptyFn: function(){}
    });

    return MsgListView;
});