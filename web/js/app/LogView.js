define(['jQuery', 'skeleton'],
function($, sk) {
    var LogView = sk.View.extend({
        vid: 'log',
        templateName: 'log',
        events: {
            "click #clear": "toClear",
            "click #hide": "toHide"
        },
        configure: function(){
            this.listenTo(this.model, 'add', this.appendLog, this);
        },
        toClear: function(){
            console.info('clear logs');
            this.model.clear();
            this.doRender();
        },
        toHide: function(){
            console.info('hide log view');
            this.hide();
        },
        appendLog: function(log){
            var level = log.get('level');
            var msg = log.get('msg');
            var className = 'text-success'
            if(level=='d'){
                className = 'muted'
                console.debug(msg);
            }
            else if(level=='i'){
                className = 'text-info'
                console.info(msg);
            }
            else if(level=='w'){
                className = 'text-warning'
                console.warn(msg);
            }
            else if(level=='e'){
                className = 'text-error'
                console.error(msg);
            }
            else {
                console.log(msg);
            }
            $('<div class="'+className+'"></div>').prependTo('.log').append(document.createTextNode(msg));
        }
    });

    return LogView;
});