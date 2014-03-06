define(['jQuery', 'skeleton', 'Bootstrap', './Manager', './ManagerView'],
function($, sk, Bootstrap, Manager, ManagerView) {
    var Liao = sk.Spa.extend({
        configure: function(){
            this.model = Manager;
            this.view = new ManagerView({
                model: Manager
            });
            $('body section > div > div[data-view-id=manager]').replaceWith(this.view.el);
        }
    });

    return Liao;
});