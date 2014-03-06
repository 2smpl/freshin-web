define(['jQuery', 'skeleton',
    './AgentHolder',
    './LogManager'],
function($, sk,
    AgentHolder,
    LogManager) {
    var CvsEntryView = sk.View.extend({
        templateName: 'cvs-entry',
        tagName: 'li',
        events: {
            "click a#cvs": "toActivate",
            "click a#remove": "toRemove",
            "click a#info": "toInfo"
        },
        configure: function() {
            this.listenTo(this.model, 'change:show', this.onShowChanged, this);
            this.listenTo(this.model, 'change:hidden', this.onHiddenChanged, this);
        },
        toActivate: function(e){
            e.preventDefault();
            this.model.activate();
            console.debug('activate cvs - ' + this.model.id + ' - ' + this.model.get('jid'));
        },
        toRemove: function(){
            this.model.hide();
            LogManager.info('hide cvs entry - ' + this.model.id + ' - ' + this.model.get('jid'));
        },
        toInfo: function(){
            LogManager.debug('conversation info - ' + JSON.stringify(this.model));
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
        onHiddenChanged: function(model, value){
            this.updateHidden(model.previous('hidden'), value);
        },
        updateHidden: function(oldHidden, hidden){
            if(hidden){
                this.hide();
            }
            else{
                this.show();
            }
        },
        afterRender: function(){
            this.updateHidden(null, this.model.get('hidden'));
            this.updateShow(this.model.get('show') || 'offline');
        }

    });
    return CvsEntryView;
});