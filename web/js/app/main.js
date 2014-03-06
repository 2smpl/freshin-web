define(['./Liao', 'JST', 'config'],
function(Liao, JST, config) {
    var appConfig = window.appConfig;

    var App = new Liao({
        mode: appConfig.mode,
        JST: JST
    });
    return App;
});