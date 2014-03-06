define(['Underscore', 'jQuery', 'skeleton', 'config', './AgentHolder',
    './ContactsView',
    './LogManager'],
function(_, $, sk, config, AgentHolder,
    ContactsView,
    LogManager) {
    var RosterView = sk.View.extend({
        vid: 'roster',
        templateName: 'roster',
        prerendered: true,
        events: {
            "click #refresh": "toRefresh",
            "click #add": "toAdd"
        },
        configure: function() {
            var contacts = this.model.contacts;
            var contactsView = new ContactsView({
                model: contacts
            });
            this.addChild(contactsView);

            this.listenTo(this.model, 'subscribe', this.onSubscriptionRequested, this);
            this.listenTo(this.model, 'unsubscribe', this.onUnsubscriptionRequested, this);
            this.listenTo(this.model, 'subscribed', this.onSubscriptionApproved, this);
            this.listenTo(this.model, 'unsubscribed', this.onUnsubscriptionApproved, this);
        },
        toRefresh: function(e){
            this.model.load();
        },
        toAdd: function(e){
            var jid = this.$('.roster #toJid').val();
            var contact = {
                jid: jid
            };
            this.model.add(contact);
            LogManager.info('Add contact - ' + jid);
        },
        onSubscriptionRequested: function (e) {
            var contact = this.model.contacts.get(e.from);
            if(contact){
                this.model.approveSubscription(e.from);
                LogManager.info(e.to + ' automatically agree the subscription request from ' + e.from);
                return;
            }
            else{
                //TODO check event stack
                LogManager.warn(e.from + ' is not existed in roster');
            }

            var ok = window.confirm('' + e.from + ' request a subscription to you, agree?'); //TODO
            LogManager.info(e.to + ' ' + (ok?'agree':'disagree') + ' the subscription request from ' + e.from);
            if(ok){
                this.model.approveSubscription(e.from);
                this.model.requestSubscription(e.from);
            }
            else{
                this.model.remove(e.from);
                this.model.rejectSubscription(e.from);
            }
        },
        onUnsubscriptionRequested: function (e) {
            this.model.rejectSubscription(e.from);
            LogManager.info(e.to + ' automatically agree the unsubscription request from ' + e.from);
            //TODO: add a alert or info dialog to update view
        },
        onSubscriptionApproved: function (e) {

        },
        onUnsubscriptionApproved: function (e) {
        }

    });

    return RosterView;
});

