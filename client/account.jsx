const helper = require('./helper.js');
const React = require('react');
const {createRoot} = require('react-dom/client');

const handlePasswordChange = (e) => {
    e.preventDefault();
    helper.hideError();

    // Making the user enter their username despite already being logged in is a temp solution
    // Ideally the username could be automatically gotten and the user only needs to enter password
    const username = e.target.querySelector('#username').value;
    const oldPass = e.target.querySelector('#oldPass').value;
    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;

    if (!username || !oldPass || !pass || !pass2){
        helper.handleError('All fields are required!');
        return false;
    }

    if (pass !== pass2){
        helper.handleError('Passwords do not match!');
        return false;
    }

    helper.sendPost(e.target.action, {oldPass, pass, pass2});
    return false;
}