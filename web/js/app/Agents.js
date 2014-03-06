define(['skeleton', 'LocalStorage', './Agent'], function(sk, LocalStorage, Agent) {
    var Agents = sk.Collection.extend({
        model: Agent,
        localStorage: new LocalStorage("liao.agent")
    });
    return Agents;
});