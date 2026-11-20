const controllers = require('./controllers');
const mid = require('./middleware');

// Connect our routes
const router = (app) => {
    app.get('/getEntries', mid.requiresLogin, controllers.Entry.getEntries);
    app.post('/removeEntry', mid.requiresLogin, controllers.Entry.removeEntry);
    app.post('/makeEntry', mid.requiresLogin, controllers.Entry.makeEntry);
    app.post('/updateEntryContent', mid.requiresLogin, controllers.Entry.updateEntryContent);

    app.get('/getContainers', mid.requiresLogin, controllers.Container.getContainers);
    app.post('/removeContainer', mid.requiresLogin, controllers.Container.removeContainer);
    app.post('/makeContainer', mid.requiresLogin, controllers.Container.makeContainer);
    app.post('/updateContainerName', mid.requiresLogin, controllers.Container.updateContainerName);

    app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
    app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

    app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

    app.get('/logout', mid.requiresLogin, controllers.Account.logout);

    app.get('/maker', mid.requiresLogin, controllers.Entry.makerPage);
    app.post('/maker', mid.requiresLogin, controllers.Entry.makerPage);

    app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;