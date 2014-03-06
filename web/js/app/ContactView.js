define(['jQuery', 'skeleton',
    './AgentHolder',
    './LogManager'],
function($, sk,
    AgentHolder,
    LogManager) {
    var ContactView = sk.View.extend({
        templateName: 'contact',
        tagName: 'li',
        events: {
            "click a#contact": "toChat",
            "click a#remove": "toRemove",
            "click a#info": "toInfo"
        },
        configure: function() {
            this.listenTo(this.model, 'change:subscription', this.onSubscriptionChanged, this);
            this.listenTo(this.model, 'change:show', this.onShowChanged, this);
            this.listenTo(this.model, 'change:message', this.onMessageChanged, this);
        },
        toChat: function(e){
            e.preventDefault();
            var jid = this.model.get('jid');
            var desk = AgentHolder.get().getAccount().desk;
            var cvs = desk.getConversation(null, jid);
            cvs.activate();
        },
        toRemove: function(){
            var jid = this.model.get('jid');
            var roster = AgentHolder.get().getAccount().roster;
            roster.remove(jid);
            LogManager.info('remove contact - ' + jid);
        },
        toInfo: function(){
            var jid = this.model.get('jid');
            var roster = AgentHolder.get().getAccount().roster;
            var contact = roster.contacts.get(jid);
            console.log(contact);
            LogManager.debug('contact info - ' + JSON.stringify(contact));
        },
        onSubscriptionChanged: function(model, value, options){
            console.debug('on subscription changed: ' + this.model.get('jid') + ' - ' + value);
            this.updateSubscription(value);
        },
        updateSubscription: function(sub){
            var subscribed = sub && (sub=='both' || sub=='to') ? true : false;
            if(!subscribed){
                this.$el.find('p').addClass('muted');
            }
            else{
                this.$el.find('p').removeClass('muted');
            }
        },
        onShowChanged: function(model, value){
            console.debug('on - roster item status is changed: ' + this.model.get('jid') + ' - ' + value);
            this.updateShow(model.previous('show'), value);
        },
        updateShow: function(oldShow, show){
            var oldShowClass = 'show-' + (oldShow=='xa' ? 'offline' : oldShow);
            var showClass = 'show-' + (show=='xa' ? 'offline' : show);
            this.$el.find('i#icon').removeClass(oldShowClass).addClass(showClass);
        },
        onMessageChanged: function(model, value, options){
            console.debug('on message changed: ' + this.model.get('jid') + ' - ' + value);
            this.updateMessage(value);
        },
        updateMessage: function(message){
            this.$el.find('label').text(message);
        },
        afterRender: function(){
            this.updateSubscription(this.model.get('subscription'));
            this.updateShow(this.model.get('show') || 'offline');
            this.updateMessage(this.model.get('message'));
        }

    });
    return ContactView;
});