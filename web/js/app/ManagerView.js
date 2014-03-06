define(['jQuery', 'jQueryCustom', 'skeleton',
    './AgentHolder', './BootView',
    './MainView',
    './LogManager', './LogView'
   ],
function($, $custom, sk,
     AgentHolder, BootView,
     MainView,
     LogManager, LogView
     ) {
    var ManagerView = sk.View.extend({
        vid: 'manager',
        templateName: 'manager',
        configure: function(){
            var agent = AgentHolder.get();
            agent.fetched = true;
            this.model.addChild('agent', agent);
            var bootView = new BootView({
                model: agent
            });
            this.addChild(bootView);

            //Configure LogManager
            this.model.addChild('LogManager', LogManager);
            var logView = new LogView({
                hidden: true,
                model: LogManager
            });
            this.addChild(logView);

            this.enableDebugToggle();
        },
        addMainView: function(){
            var agent = this.model.getChild('agent');
            var account = agent.getAccount();
            var mainView = new MainView({
                renderPlacing: false,
                model: account
            });
            this.addChild(mainView);
            this.renderChild(mainView);
        },
        removeMainView: function(){
            var mainView = this.getChild('main');
            this.removeChild('main');
            mainView.destroy();
        },
        enableDebugToggle: function(){
            var $debug = $('li#debug');
            var logView = this.getChild('log');
            $debug.on('click', function () {
                $debug.toggleClass('active');
                if($debug.hasClass('active')){
                    logView.show();
                }
                else{
                    logView.hide();
                }
            });
        },
        afterRenderChildren: function(){
            setTimeout(function(){
                $('#connect').click();
            }, 100);
        }
    });

    return ManagerView;
});