const helper = require('./helper.js');
const React = require('react');
const {createRoot} = require('react-dom/client');

const handlePasswordChange = (e) => {
    e.preventDefault();
    helper.hideError();

    // Making the user enter their username despite already being logged in is a temp solution
    // Ideally the username could be automatically gotten and the user only needs to enter password
    // But im not sure how to do that :shrugs:
    const username = e.target.querySelector('#user').value;
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

    helper.sendPost(e.target.action, {username, oldPass, pass, pass2});
    return false;
}

const AccountInfo = (props) => {
    return (
        <form id="passwordChangeForm"
        name="passwordChangeForm"
        onSubmit={handlePasswordChange}
        action="/changePass"
        method="POST"
        className="mainForm"
        >
            <label htmlFor="username">Username: </label>
            <input id='user' type='text' name='username' placeholder='username' />
            <label htmlFor='oldPass'>Old Password: </label>
            <input id="oldPass" type='password' name='oldPass' placeholder='old password' />
            <label htmlFor='pass'>New Password: </label>
            <input id="pass" type='password' name='pass' placeholder='new password' />
            <label htmlFor='pass2'>Retype Password: </label>
            <input id="pass2" type='password' name='pass2' placeholder='retype new password' />
            <input className='formSubmit' type='submit' value='Change password' />
        </form>
    );
}

const init = () => {
    const root = createRoot(document.getElementById('content'));

    root.render(<AccountInfo />);
}

window.onload = init;