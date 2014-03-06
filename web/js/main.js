require.config({
    baseUrl: './web/js',
    shim: {
        'jQuery': {
            exports: '$'
        },
        'Underscore': {
            exports: '_'
        },
        'Backbone': {
            deps: ['Underscore', 'jQuery'],
            exports: 'Backbone'
        },
        'LocalStorage': {
            deps: ['Underscore', 'Backbone'],
            exports: 'LocalStorage'
        },
        'Bootstrap': {
            deps: ['jQuery']
        },
        'Strophe': {
            deps: ['jQuery'],
            exports: 'Strophe'
        },
        'JST': {
            exports: 'JST'
        }
    },
    packages: ["skeleton", "strophe", "misc", "config", "app"],
    paths: {
        requireLib : '../../public/components/requirejs/require',
        jQuery: '../../public/components/jquery/jquery',
        Underscore: '../../public/components/underscore/underscore',
        Backbone: '../../public/components/backbone/backbone',
        LocalStorage: '../../public/components/backbone.localstorage/backbone.localStorage',
        Bootstrap: '../../public/components/bootstrap-tl/tl/js/bootstrap',
        Strophe: '../../public/components/strophe/strophe',
        JST: '../../public/build/js/templates',
        jQueryCustom: 'jquery.custom'
    },
    deps: ['app', 'misc'],
    callback: function(){},
    preserveLicenseComments: false
});