define(['jQuery', 'skeleton', './Conversation', './CvsEntryView'],
function($, sk, Conversation, CvsEntryView) {
    var CvsEntriesView = sk.View.extend({
        vid: 'cvs-entries',
        templateName: 'cvs-entries',
        configure: function(){
            this.listenTo(this.model, 'add', this.onItemAdded, this);
            this.listenTo(this.model, 'remove', this.onItemRemoved, this);
            var me = this;
            this.listenTo(this.model, 'list', function(models) {
                console.log(models.length + ' conversations are loaded');
//                alert('list length ' + models.length);
                me.renderItems(models);
            });
        },
        onItemAdded: function(model, collection, options){
            console.debug('cvs entry ' + model.get('jid') + ' is added');
            this.addItemView(model); //TODO UNCOMMENT
        },
        onItemRemoved: function(model, collection, options){
            console.debug('cvs entry ' + model.get('jid') + ' is removed');
            this.removeItemView(model);
        },
        renderChildren: function() {
            this.renderItems(this.model.models);
        },
        renderItems: function(items) {
            var $el = this.$el.find('div ul');
            var fragment = document.createDocumentFragment();
            var itemView = null;
            for(var index = 0; index<items.length; index++){
                itemView = this.newItemView(items[index]);
                fragment.appendChild(itemView.el);
            }

//            alert('renderItems ' + items.length);
            $el.append(fragment);
        },
        newItemView: function(item) {
            var itemView = new CvsEntryView({
                vid: item.id,
                model: item
            });
            this.addChild(itemView);
            return itemView;
        },
        addItemView: function(item) {
            var $el = this.$el.find('div ul');
            var itemView = this.newItemView(item);
            $el.append(itemView.el);

            console.error('addItemView' + JSON.stringify(item));
//            alert('addItemView' + JSON.stringify(item));
        },
        removeItemView: function(item) {
            var vid = item.id;
            var itemView = this.getChild(vid);
            if(itemView){
                this.removeChild(vid);
                itemView.destroy();
            }
        }

    });

    return CvsEntriesView;
});