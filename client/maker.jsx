const helper = require('./helper.js')
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require("react-dom/client");

const handleEntry = (e, onEntryAdded) => {
    e.preventDefault();
    helper.hideError();

    const type = e.target.querySelector('#entryType').value;
    const content = e.target.querySelector('#entryContent').value;
    const color = e.target.querySelector('#entryColor').value;
    const parentContainer = e.target.querySelector('#entryParentContainer') ? e.target.querySelector('#entryParentContainer').value : 'inbox';

    if (!type || !content || !color) {
        helper.handleError('All fields are required!');
        return false;
    }

    helper.sendPost(e.target.action, { type, content, color, parentContainer }, onEntryAdded);
    return false;
};
const handleContainer = (e, onContainerAdded) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#containerName').value;
    const color = e.target.querySelector('#containerColor').value;

    if (!name || !color) {
        helper.handleError('All fields are required!');
        return false;
    }

    helper.sendPost(e.target.action, { name, color}, onContainerAdded);
    return false;
};
// Handles the deletion of an entry based on its id
const handleDeleteEntry = (id, onEntryRemoved) => {
    helper.hideError();

    helper.sendPost('/removeEntry', { id }, onEntryRemoved);
    return false;
}

// Handles the deletion of an entry based on its id
const handleDeleteContainer = (id, onContainerRemoved) => {
    helper.hideError();

    helper.sendPost('/removeContainer', { id }, onContainerRemoved);
    return false;
}

// ----- REACT COMPONENTS -----

const ContainerForm = (props) => {
    return (
        <form id='containerForm'
            onSubmit={(e) => handleContainer(e, props.triggerReload)}
            name="containerForm"
            action="/makeContainer"
            method="POST"
            className="containerForm"
        >
            <input id="containerName" type="text" name="containerName" placeholder="Enter container name" />
            <label htmlFor="containerColor">Color: </label>
            <input id="containerColor" type="color" name="containerColor" defaultValue="#4bbf5c" />
            <input className="makeContainerSubmit" type="submit" value="Create Container" />
        </form>
    )
}

// Form to make an entry
const EntryForm = (props) => {
    return (
        <form id='entryForm'
            onSubmit={(e) => handleEntry(e, props.triggerReload)}
            name="entryForm"
            action="/makeEntry"
            method="POST"
            className="entryForm"
        >
            <label htmlFor="entryType">Type: </label>
            <select name="entryTypes" id="entryType">
                <option value="task">Task</option>
                <option value="event">Event</option>
                <option value="note">Note</option>
            </select>
            <input id="entryContent" type="text" name="entryContent" placeholder="Enter entry description" />
            <label htmlFor="entryColor">Color: </label>
            <input id="entryColor" type="color" name="entryColor" defaultValue="#4bbfa6" />
            <input className="makeEntrySubmit" type="submit" value="Create Entry" />
        </form>
    )
};

const ContainerList = (props) => {
    return(
        <div className="container">
            <EntryList props></EntryList>
        </div>
    )
}

// Component to display list of Entries
// Entries are stored in array using useState hook: allowing updating/rerendering
// An effect loads entries from server and updates state
// useEffect hook has props.reloadEntries as dependency
const EntryList = (props) => {
    const [entries, setEntries] = useState(props.entries);

    useEffect(() => {
        const loadEntriesFromServer = async () => {
            const response = await fetch('/getEntries');
            const data = await response.json();
            setEntries(data.entries);
        };
        loadEntriesFromServer();
    }, [props.reloadEntries]);

    if (entries.length === 0) {
        return (
            <div className="entryList">
                <h3 className="emptyEntry">No Entries Yet!</h3>
            </div>
        );
    };

    const entryNodes = entries.map(entry => {
        return (
            <div key={entry._id} className="entry" style={{backgroundColor :entry.color}}>

                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="entryType">{entry.type}: </h3>
                <h3 className="entryContent">{entry.content}</h3>

                <button
                    className="removeEntrySubmit"
                    onClick={() => handleDeleteEntry(entry._id, props.triggerReload)}
                >
                    Remove Entry
                </button>

            </div>
        )
    });

    return (
        <div className='entryList'>
            {entryNodes}
        </div>
    );
};

const App = () => {
    // Create stateful variable reloadEntries
    const [reloadEntries, setReloadEntries] = useState(false); // Boolean

    return (
        <div>
            <div id="makeEntry">
                {/* When rendering entryForm, create triggerReload prop.
                Function calls setReloadEntry, and passes in negation of
                reload entries into the entryList */}
                <EntryForm triggerReload={() => setReloadEntries(!reloadEntries)} />
            </div>
            <div id="entries">
                <EntryList entries={[]} reloadEntries={reloadEntries} triggerReload={() => setReloadEntries(!reloadEntries)} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('content'));
    root.render(<App />);
};

window.onload = init;