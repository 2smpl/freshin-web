define(['skeleton', 'config', 'LocalStorage', './Contact'],
function(sk, config, LocalStorage, Contact) {

    var Contacts = sk.Collection.extend({
        model: Contact,
        url: 'contacts',
        name: 'Contacts',
        localStorage: new LocalStorage("liao.contact"),
        configure: function(){

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
    return Contacts;
});