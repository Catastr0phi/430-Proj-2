const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const {createRoot} = require('react-dom/client');

// Handles users adding their own levels from the form
const handleCustomLevelCreation = (e, onLevelAdded) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#levelName').value;
    const id = e.target.querySelector('#levelID').value;
    const time = e.target.querySelector('#levelTime').value;

    if (!name || !id) {
        helper.handleError('Name and ID are required!');
        return false;
    }

    let data = {name: name, id: id, custom: true};

    if (time) data.time = time;

    helper.sendPost(e.target.action, data, onLevelAdded);
    return false;
}

const handleUpdate = (e, levelName, onLevelUpdated) => {
    e.preventDefault();
    helper.hideError();

    const name = levelName;
    const time = e.target.querySelector('#levelTime').value;

    if (!time) {
        helper.handleError('New time required!');
        return false;
    }

    helper.sendPost(e.target.action, {name, time}, onLevelUpdated);
    return false;
}

const LevelForm = (props) => {
    return (
        <form id='levelForm'
        onSubmit={(e) => handleCustomLevelCreation(e, props.triggerReload)}
        name='levelForm'
        action='/addLevel'
        method='POST'
        className='levelForm'
        >
            <label htmlFor="name">Name: </label>
            <input id='levelName' type='text' name='name' placeholder='Level Name' />
            <label htmlFor="id">ID: </label>
            <input id='levelID' type='text' name='id' placeholder='Level ID' />
            <label htmlFor='time'>Time: </label>
            <input id="levelTime" type='number' min='0' name='time' />
            <input className='addLevelSubmit' type='submit' value='Add Level' />            
        </form>
    )
}

const LevelList = (props) => {
    const [levels, setLevels] = useState(props.levels);

    useEffect(() => {
        const loadLevelsFromServer = async () => {
            const response = await fetch('/getLevels');
            const data = await response.json();
            setLevels(data.levels);
        };
        loadLevelsFromServer();
    }, [props.reloadLevels]);

    if (levels.length === 0){
        return (
            <div className='levelList'>
                <h3 className='emptyLevel'>No Levels Added!</h3>
            </div>
        );
    }

    const levelNodes = levels.map(level => {
        return (
            <div key={level.id} className='level'>
                <h3 className='levelName'>Name: {level.name}</h3>
                <h3 className='levelID'>ID: {level.id}</h3>
                <form id='timeForm'
                onSubmit={(e) => handleUpdate(e, level.name, props.triggerReload)}
                name='timeForm'
                action='/updateTime'
                method='POST'
                className='timeForm'
                >
                    <input id="levelTime" type='number' name='time' placeholder='Update time' />
                    <input className='newTimeSubmit' type='submit' value='Update' />    
                </form>
                <h3 className='levelTime'>{level.time ? (
                    `Time: ${level.time}`
                ) : (
                    'No time recorded!'
                )
                }</h3>
            </div>
        );
    });

    return (
        <div className='levelList'>
            {levelNodes}
        </div>
    );
};

const App = () => {
    const [reloadLevels, setReloadLevels] = useState(false);

    return (
        <div>
            <div id='makeLevel'>
                <LevelForm triggerReload={() => setReloadLevels(!reloadLevels)} />
            </div>
            <div id='levels'>
                <LevelList levels={[]} reloadLevels={reloadLevels} triggerReload={() => setReloadLevels(!reloadLevels)} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
}

window.onload = init;