define(['jQuery', 'jQueryCustom', 'skeleton',
    './Navigator', './NavigatorView',
    './Workbench', './WorkbenchView',

        './LogManager'
       ],
function($, $custom, sk,
         Navigator, NavigatorView,
         Workbench, WorkbenchView,
     LogManager
     ) {
    var MainView = sk.View.extend({
        vid: 'main',
        templateName: 'main',
        events: {
            "change .header #show": "toChangeShow",
            "change .header #message": "toChangeMessage",
            "click .header #signout": "toSignOut",
            "click .header #account": "toPrintAccount"
        },
        configure: function(){
            this.listenTo(this.model, 'change:show', this.onShowChanged, this);
            this.listenTo(this.model, "connected", this.onConnected, this);
            this.listenTo(this.model, "disconnected", this.onDisconnected, this);

            //Configure navigator
            var navigator = new Navigator();
            navigator.fetched = true;
            this.model.addChild('navigator', navigator);
            var navigatorView = new NavigatorView({
                model: navigator
            });
            this.addChild(navigatorView);

            //Configure workbench
            var workbench = new Workbench();
            workbench.fetched = true;
            this.model.addChild('workbench', workbench);
            var workbenchView = new WorkbenchView({
                model: workbench
            });
            this.addChild(workbenchView);
        },
        toSignOut: function(){
            this.model.signout();
        },
        toChangeShow: function(e){
            var show = this.$(e.target).val();
            var account = this.model;
            account.changeShow(show);
        },
        toChangeMessage: function(e){
            var message = this.$(e.target).val();
            var account = this.model;
            account.changeMessage(message);
        },
        toPrintAccount: function(e){
            LogManager.info('print account');
            var account = this.model;
            console.log(account);
        },
        onShowChanged: function(model, value){
            this.$('.main #show').val(value);
        },
        onConnected: function(){
        },
        onDisconnected: function(){
        }
    });

    return MainView;
});