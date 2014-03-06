define(['Underscore', 'skeleton',
    './LogManager'],
function(_, sk,
         LogManager) {
    var Messager = sk.Model.extend({
        name: 'Messager',
        idAttribute: 'id',
        configure: function(){
            this.inQueue = [];
            this.outQueue = [];
        },
        use: function(agent){
            var delegate = agent.connection.messaging;
            this.agent = agent;
            this.delegate = delegate;
            var Events = delegate.Events;
            delegate.on(Events.message, this.onMessage, this);
        },
        send: function(msg){
            this.delegate.send(msg);
        },
        onMessage: function(msg){
            this.trigger('message', msg);
            LogManager.debug('on - new message received - '+msg.from+' - '+msg.body);
        },
        emptyFn: function () {}
    });
    return Messager;
});