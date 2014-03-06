define(['jQuery', 'skeleton','./Log'],
function($, sk, Log) {
    var LogManager = sk.Collection.extend({
        model: Log,
        name: 'LogManager',
        configure: function(){
        },
        clear: function(){
            this.reset();
        },
        debug: function(msg){
            var log = new Log({level: 'd', msg: msg});
            this.add(log);
        },
        info: function(msg){
            var log = new Log({level: 'i', msg: msg});
            this.add(log);
        },
        warn: function(msg){
            var log = new Log({level: 'w', msg: msg});
            this.add(log);
        },
        error: function(msg){
            var log = new Log({level: 'e', msg: msg});
            this.add(log);
        }

    });

    var logManager = new LogManager();
    return logManager;
});