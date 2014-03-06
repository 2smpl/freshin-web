define(['jQuery', 'skeleton', './Contact', './ContactView'],
function($, sk, Contact, ContactView) {
    var ContactsView = sk.View.extend({
        vid: 'contacts',
        templateName: 'contacts',
        configure: function(){
            this.listenTo(this.model, 'add', this.onItemAdded, this);
            this.listenTo(this.model, 'remove', this.onItemRemoved, this);
            var me = this;
            this.listenTo(this.model, 'load', function(models) {
                console.log(models.length + ' contacts are loaded');
                me.renderItems(models);
            });
        },
        onItemAdded: function(model, collection, options){
            console.debug('roster item ' + model.get('jid') + ' is added');
            this.addItemView(model);
        },
        onItemRemoved: function(model, collection, options){
            console.debug('roster item ' + model.get('jid') + ' is removed');
            this.removeItemView(model);
        },
        renderItems: function(items) {
            var $el = this.$el.find('div ul');
            var fragment = document.createDocumentFragment();
            var itemView = null;
            for(var index = 0; index<items.length; index++){
                itemView = this.newItemView(items[index]);
                fragment.appendChild(itemView.el);
            }
            $el.append(fragment);
        },
        newItemView: function(item) {
            var itemView = new ContactView({
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

    return ContactsView;
});