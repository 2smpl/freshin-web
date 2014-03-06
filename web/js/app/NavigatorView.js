define(['jQuery', 'skeleton',
    './AgentHolder',
    './RosterView',
    './DeskView'
    ],
function($, sk,
    AgentHolder,
    RosterView,
    DeskView
    ) {
    var NavigatorView = sk.View.extend({
        vid: 'navigator',
        templateName: 'navigator',
        routes: {
            "desk": "desk"
            ,"roster": "roster"
        },
        configure: function(){
            var agent = AgentHolder.get();
            var account = agent.getAccount();

            //Desk
            var desk = account.desk;
            desk.fetched = true;
            this.model.addChild('desk', desk);
            var deskView = new DeskView({
                model: desk
            });
            this.addChild(deskView);

            //Roster
            var roster = account.roster;
            roster.fetched = true;
            this.model.addChild('roster', roster);
            var rosterView = new RosterView({
                model: roster
            });
            this.addChild(rosterView);
        },
        activate: function(tab){
            this.$('ul.nav-tabs li').removeClass('active');
            this.$('li#tab-' + tab).addClass('active');
            this.$('div.tab-content div.tab-pane').removeClass('active');
            this.$('div#' + tab).addClass('active');
        },
        desk: function() {
            this.activate('desk');
            console.debug('desk');
        },
        roster: function() {
            this.activate('roster');
            console.debug('roster');
        },
        afterRender: function() {
        }
    });

    return NavigatorView;
});