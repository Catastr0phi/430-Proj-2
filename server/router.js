const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
    app.get('/getLevels', mid.requiresLogin, controllers.Level.getLevels);
    app.get('/getLevelsOfCategory', mid.requiresLogin, controllers.Level.getLevelsOfCategory)

    app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
    app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
    app.get('/account', mid.requiresSecure, mid.requiresLogin, controllers.Account.accountPage)
    app.post('/changePass',mid.requiresSecure, mid.requiresLogin, controllers.Account.changePass)
    app.post('/goPremium', mid.requiresSecure, mid.requiresLogin, controllers.Account.goPremium)
    app.get('/getPremiumStatus', mid.requiresSecure, mid.requiresLogin, controllers.Account.getPremiumStatus)

    app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

    app.get('/logout', mid.requiresLogin, controllers.Account.logout);


    app.get('/tracker', mid.requiresLogin, controllers.Level.trackerPage);
    app.post('/addLevel', mid.requiresLogin, controllers.Level.makeLevel);
    app.post('/updateTime', mid.requiresLogin, controllers.Level.updateTime);

    app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);

    // Nonexistent page redirection
    app.get('/*splat', (req, res) => {res.render('notfound')});
};

module.exports = router;