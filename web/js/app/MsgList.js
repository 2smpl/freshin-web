define(['skeleton', 'config', './MsgItem'],
function(sk, config, MsgItem) {

    var MsgList = sk.Collection.extend({
        model: MsgItem,
        url: 'msgs',
        name: 'MsgList',
        configure: function(){

        },
        addReceivedMsg: function(msg){
            var item = new MsgItem(msg);
            item.set('action', 'from');
            this.add(item);
            item.save();
        },
        addSentMsg: function(msg){
            var item = new MsgItem(msg);
            item.set('action', 'to');
            this.add(item);
            item.save();
        },
        newContact: function(item){
            console.debug('new contact');
            item.show = 'offline';
            return new Contact(item);
        },
        addContact: function(item){
            console.debug('add contact');
            this.add(new Contact(item));
        },
        updateContact: function(item){
            console.debug('update contact');
            var contact = this.get(item.jid);
            if(contact){
                contact.set(item);
            }
        },
        removeContact: function(models){
            console.debug('remove contacts');
            this.remove(models);
        }
    });
    return MsgList;
});