module.exports = {
    id: 'li',
    name: 'liao',
    creator: 'henryleu',
    secretKey: 'quick',
    port: 3020,
    redis:{
        host: 'localhost',
        port: 6379
    },
    logging: {
        reloadSecs: 0, //INFO: set 0 could let nodeunit tests which use log4js exit properly
        level: 'DEBUG'
    },
    resources: {
        appName: '极聊',
        appTitle: '有“极聊”，不寂寥',
        appCreator: '番茄实验室',
        errorUnknown: '不好意思，系统出了点小问题'
    }
}
;
