define(['jQuery', 'Underscore', 'skeleton', 'strophe', './LogManager'],
function($, _, sk, Strophe, LogManager) {

    var Status = Strophe.Status;
    var StatusName = _.invert(Status);

    var BootView = sk.View.extend({
        vid: 'boot',
        templateName: 'boot',
        events: {
            "click .boot #connect": "toSignin",
            "click .boot #disconnect": "toSignout",
            "change .boot #show": "toChangeShow"
        },
        configure: function(){
            var account = this.model.getAccount();
            this.listenTo(account, 'connected', this.onConnected, this);
            this.listenTo(account, 'online', this.onOnline, this);
            this.listenTo(account, 'enter', this.onEnter, this);
            this.listenTo(account, 'disconnected', this.onDisconnected, this);
            this.listenTo(account, 'offline', this.onOffline, this);
            this.listenTo(account, 'exit', this.onExit, this);
            this.listenTo(account, 'change:status', this.onStatusChanged, this);
            this.listenTo(account, 'change:show', this.onShowChanged, this);

            this.enableShowList();
            this.onShowInitiated();
        },
        saveAccount: function(){
            var account = this.model.getAccount();
            account.set('username', this.$('.boot #jid').val());
            account.set('password', this.$('.boot #password').val());
            account.set('resource', this.$('.boot #resource').val());
            account.set('show', this.$('.boot #show').val());
            account.set('message', this.$('.boot #message').val());
            account.save();
        },
        toSignin: function(e){
            this.saveAccount(); //Get login information
            var account = this.model.getAccount();
            account.signin();

            var $el = this.$('.boot #connect');
            $el.addClass('active').addClass('disabled').attr('disabled', true);
        },
        toSignout: function(e){
            var account = this.model.getAccount();
            account.signout();

            var $el = this.$('.boot #disconnect');
            $el.addClass('active').addClass('disabled').attr('disabled', true);
        },
        toChangeShow: function(e){
            var show = this.$(e.target).val();
            var account = this.model.getAccount();
            account.changeShow(show);
        },
        onStatusChanged: function(model, value){
            this.$('#status').text(StatusName[value]);
            LogManager.debug('on - connection status is changed to ' + StatusName[value]);

            if(value==Status.AUTHFAIL){
                var account = this.model.getAccount();
                account.signout();
                if(!this.$('#connect').hasClass('hide')){
                    this.$('#connect').removeClass('active').removeClass('disabled').attr('disabled', false);
                }
                if(!this.$('#disconnect').hasClass('hide')){
                    this.$('#disconnect').removeClass('active').removeClass('disabled').attr('disabled', false);
                }
            }
            else if(value==Status.CONNFAIL || value==Status.ERROR){
                if(!this.$('#connect').hasClass('hide')){
                    this.$('#connect').removeClass('active').removeClass('disabled').attr('disabled', false);
                }
                if(!this.$('#disconnect').hasClass('hide')){
                    this.$('#disconnect').removeClass('active').removeClass('disabled').attr('disabled', false);
                }
            }
            else{
                console.debug(StatusName[value]);
            }
        },
        onConnected: function(){
        },
        onOnline: function(){
            this.onShowInitiated();
        },
        onEnter: function(){
            this.$('#connect').addClass('hide').removeClass('active').removeClass('disabled').attr('disabled', false);
            this.$('#disconnect').removeClass('hide');
            this.getParent().addMainView();
            this.hide();
        },
        onDisconnected: function(){
        },
        onOffline: function(){
            this.onShowInitiated();
        },
        onExit: function(){
            this.onShowInitiated();
            this.$('#connect').removeClass('hide');
            this.$('#disconnect').addClass('hide').removeClass('active').removeClass('disabled').attr('disabled', false);
            this.show();
            this.getParent().removeMainView();
        },
        enableShowList: function(){
            var account = this.model.getAccount();
            var $icon = $('li#account-show > a > i');
            var $list = $('li#account-show > ul > li');
            $list.click(function(e){
                var show = $(this).find('a i').attr('value');
                if(show){
                    var oldShow = $icon.attr('value');
                    if(oldShow!=show){
                        $icon.attr('value', show);
                        $icon.removeClass('show-'+oldShow).addClass('show-'+show);
                        account.changeShow(show);
                    }
                }
            });
        },
        enableDebugToggle: function(){
            var $debug = $('li#debug');
            $debug.on('click', function () {
                $debug.toggleClass('active');
            });
        },
        onShowInitiated: function(){
            var account = this.model.getAccount();
            var connected = account.get('connected');
            var show = account.get('show');
            var $link = $('li#account-show');
            var $icon = $('li#account-show > a > i');

            var oldShow = $icon.attr('value');
            var keep = account.get('keep');
            if(!keep){
                $icon.removeClass('show-'+oldShow).addClass('show-'+show).attr('value', show);
                if(connected){
                    $link.removeClass('hide');
                }
                else{
                    $link.addClass('hide');
                }
            }
            console.debug('on - current status ' + oldShow + ' - ' + show);
        },
        onShowChanged: function(model, value){
            var oldShow = model.previous('show');
            var show = value;
            var $icon = $('li#account-show > a > i');

            console.debug('on - current status ' + oldShow + ' - ' + show);
            $icon.removeClass('show-'+oldShow).addClass('show-'+show).attr('value', show);

            this.$('.boot #show').val(value);
        },
        emptyFn: function(){}
    });

    return BootView;
});