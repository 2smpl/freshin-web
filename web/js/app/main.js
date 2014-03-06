define(['./Freshin', 'JST', 'config'],
function(Freshin, JST, config) {
    var appConfig = window.appConfig;

    var App = new Freshin({
        mode: appConfig.mode,
        JST: JST
    });
    return App;
});