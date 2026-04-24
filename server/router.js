const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
    app.get('/getDomos', mid.requiresLogin, controllers.Domo.getDomos);
    app.get('/getLevels', mid.requiresLogin, controllers.Level.getLevels);

    app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
    app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
    app.get('/account', mid.requiresLogin, controllers.Account.accountPage)
    app.post('/changePass', mid.requiresLogin, controllers.Account.changePass)
    app.post('/goPremium', mid.requiresLogin, controllers.Account.goPremium)

    app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

    app.get('/logout', mid.requiresLogin, controllers.Account.logout);

    app.get('/maker', mid.requiresLogin, controllers.Domo.makerPage);
    app.post('/maker', mid.requiresLogin, controllers.Domo.makeDomo);
    app.post('/updateStatus', mid.requiresLogin, controllers.Domo.updateStatus)

    app.get('/tracker', mid.requiresLogin, controllers.Level.trackerPage);
    app.post('/addLevel', mid.requiresLogin, controllers.Level.makeLevel);
    app.post('/updateTime', mid.requiresLogin, controllers.Level.updateTime);

    app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;