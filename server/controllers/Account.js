const models = require('../models');
const Account = models.Account;
const Level = require('./Level.js');

const loginPage = (req, res) => {
    return res.render('login');
}

const signupPage = (req, res) => {
    return res.render('signup');
}

const accountPage = (req, res) => {
    return res.render('account');
}

const logout = (req, res) => {
    req.session.destroy();
    return res.redirect('/');
}

const login = (req, res) => {
    const username = `${req.body.username}`;
    const pass = `${req.body.pass}`;

    if (!username || !pass){
        return res.status(400).json({error: 'All fields are required!'});
    }

    return Account.authenticate(username, pass, (err, account) => {
        if (err || !account) {
            return res.status(401).json({error: 'Wrong username or password!'});
        }

        req.session.account = Account.toAPI(account);

        return res.json({redirect: '/tracker'});
    })
}

const changePass = async (req, res) => {
    const username = `${req.session.account.username}`;
    const oldPass = `${req.body.oldPass}`;
    const pass = `${req.body.pass}`;
    const pass2 = `${req.body.pass2}`;

    if (!username || !oldPass || !pass || !pass2){
        return res.status(400).json({error: 'All fields are required!'});
    }

    if (pass !== pass2){
        return res.status(400).json({error: 'Passwords do not match!'});
    }

    Account.authenticate(username, oldPass, (err, account) => {
        if (err || !account) {
            return res.status(401).json({error: 'Wrong username or password!'})
        }
    })

    const hash = await Account.generateHash(pass);

    await Account.findOneAndUpdate({username: username}, {password: hash});
    return res.status(201)
}

const goPremium = async (req, res) => {
    try {
        const query = {username: req.session.account.username};
        const update = {premium: true};

        await Account.findOneAndUpdate(query, update);

        return res.status(201);
    } catch (err) {
        console.log(err);
        return res.status(500).json({error: 'Error activating premium!'});
    }
}

const signup = async (req, res) => {
    const username = `${req.body.username}`;
    const pass = `${req.body.pass}`;
    const pass2 = `${req.body.pass2}`;

    if (!username || !pass || !pass2){
        return res.status(400).json({error: 'All fields are required!'});
    }

    if (pass !== pass2){
        return res.status(400).json({error: 'Passwords do not match!'});
    }

    try {
        const hash = await Account.generateHash(pass);
        const newAccount = new Account({username, password: hash});
        await newAccount.save();
        req.session.account = Account.toAPI(newAccount);
        await Level.createAllBaseLevels(req, res);
        return res.json({redirect: '/tracker'});
    } catch (err) {
        console.log(err);
        if (err.code === 11000){
            return res.status(400).json({error: 'Username already in use!'});
        }
        return res.status(400).json({error: 'An error occured!'});
    }
}


module.exports = {
    loginPage,
    signupPage,
    accountPage,
    login,
    logout,
    signup,
    changePass,
    goPremium
}