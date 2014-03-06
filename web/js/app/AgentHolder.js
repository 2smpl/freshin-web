define(['misc', './Repository', './Agents', './Agent', './Accounts', './Account'],
function(misc, Repository, Agents, Agent, Accounts, Account) {

    var agents = new Agents();
    var agent = null;

    agents.fetch();
    console.debug('agents.length: ' + agents.length);
    if(agents.length<=0){
        var id = ''+new Date().getTime();
        var utoken = id;
        var atoken = id;
        var osName = misc.Util.osName();
        var browserName = misc.Util.browser().browserName;
        var resource = osName + '/' + browserName;
        agent = new Agent({
            id: id,
            utoken: utoken,
            atoken: atoken,
            resource: resource,
            accountId: null
        });
        agents.on('add', function(){
            console.info('default agent is added'); //TODO
        });
        agents.add(agent);
        agent.save(null, {success: function(){
            console.info('default agent is saved'); //TODO
        }});
    }
    else{
        agent = agents.at(0);
        console.debug('agent is loaded');
        console.debug(agent);
    }

    //use accounts
    var accounts = new Accounts();
    accounts.fetch();
    agent.accounts = accounts;


    //use current account
    var accountId = agent.get('accountId');
    var account = null;
    console.info('current account id: ' + accountId); //TODO
    if(!accountId){
        accountId = ''+new Date().getTime();
        account = new Account({
            id: accountId,
            username: 'test@localhost',
            password: 'test',
            resource: agent.get('resource')
        });
        accounts.on('add', function(){
            console.info('current account is added'); //TODO
        });
        accounts.add(account);
        account.save(null, {success: function(){
            console.info('current account is saved'); //TODO
        }});
        agent.useAccount(account);
        account.on('change', function(){console.log('account is changed');});
    }
    else{
        account = accounts.get(accountId);
        agent.useAccount(account);
        console.debug('account is used');
    }
    account.set('connected', false);
    console.debug(account);


    var id = agent.id;
    Repository.put('agent', id, agent);
    var AgentHolder = {
        get: function(){
            return Repository.get('agent', id);
        }
    };
    return AgentHolder;
});