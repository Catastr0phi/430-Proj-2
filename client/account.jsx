const helper = require('./helper.js');
const React = require('react');
const {createRoot} = require('react-dom/client');

const handlePasswordChange = (e) => {
    e.preventDefault();
    helper.hideError();

    const oldPass = e.target.querySelector('#oldPass').value;
    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;

    if (!oldPass || !pass || !pass2){
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

const handlePremium = (e) => {
    e.preventDefault();
    helper.hideError();

    helper.sendPost(e.target.action, {});
    return false;
}

const PasswordChange = (props) => {
    return (
        <div>
        <form id="passwordChangeForm"
        name="passwordChangeForm"
        onSubmit={handlePasswordChange}
        action="/changePass"
        method="POST"
        className="mainForm"
        >
            <label htmlFor='oldPass'>Old Password: </label>
            <input id="oldPass" type='password' name='oldPass' placeholder='old password' />
            <label htmlFor='pass'>New Password: </label>
            <input id="pass" type='password' name='pass' placeholder='new password' />
            <label htmlFor='pass2'>Retype Password: </label>
            <input id="pass2" type='password' name='pass2' placeholder='retype new password' />
            <input className='formSubmit' type='submit' value='Change password' />
        </form>
        <PremiumUpgrade></PremiumUpgrade>
        </div>
    );
}

const PremiumUpgrade = (props) => {
    return (
        <button onClick={handlePremium} action="/goPremium">Go Premium</button>
    )
}

const init = () => {
    const root = createRoot(document.getElementById('content'));

    root.render(<PasswordChange />);
    //root.render(<PremiumUpgrade />);
}

window.onload = init;