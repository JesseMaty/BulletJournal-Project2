const helper = require('./helper.js')
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require("react-dom/client");

const handleDomo = (e, onDomoAdded) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#domoName').value;
    const age = e.target.querySelector('#domoAge').value;
    const peopleEaten = e.target.querySelector('#domoPeopleEaten').value;

    if (!name || !age || !peopleEaten) {
        helper.handleError('All fields are required!');
        return false;
    }

    helper.sendPost(e.target.action, { name, age, peopleEaten }, onDomoAdded);
    return false;
};

// Handles the deletion of a domo based on its id
const handleDelete = (id, onDomoRemoved) => {
    helper.hideError();

    helper.sendPost('/removeDomo', {id}, onDomoRemoved);
}

// ----- REACT COMPONENTS -----

// Form to make a domo
const DomoForm = (props) => {
    return (
        <form id='domoForm'
            onSubmit={(e) => handleDomo(e, props.triggerReload)}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm"
        >
            <label htmlFor="domoName">Name: </label>
            <input id="domoName" type="text" name="name" placeholder="Domo Name" />
            <label htmlFor="domoAge">Age: </label>
            <input id="domoAge" type="number" name="age" />
            <label htmlFor="domoPeopleEaten">People Eaten: </label>
            <input id="domoPeopleEaten" type="number" name="peopleEaten" />
            <input className="makeDomoSubmit" type="submit" value="Make Domo" />
        </form>
    )
};

// Component to display list of Domos
// Domos are stored in array using useState hook: allowing updating/rerendering
// An effect loads domos from server and updates state
// useEffect hook has props.reloadDomos as dependency
const DomoList = (props) => {
    const [domos, setDomos] = useState(props.domos);

    useEffect(() => {
        const loadDomosFromServer = async () => {
            const response = await fetch('/getDomos');
            const data = await response.json();
            setDomos(data.domos);
        };
        loadDomosFromServer();
    }, [props.reloadDomos]);

    if (domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos Yet!</h3>
            </div>
        );
    };

    const domoNodes = domos.map(domo => {
        return (
            <div key={domo.id} className="domo">

                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName">Name: {domo.name}</h3>
                <h3 className="domoAge">Age: {domo.age}</h3>
                <h3 className="domoPeopleEaten">People Eaten: {domo.peopleEaten}</h3>

                <button
                    className="removeDomoSubmit"
                    onClick={() => handleDelete(domo._id, props.triggerReload)}
                >
                    Remove Domo
                </button>

            </div>
        )
    });

    return (
        <div className='domoList'>
            {domoNodes}
        </div>
    );
};

const App = () => {
    // Create stateful variable reloadDomos
    const [reloadDomos, setReloadDomos] = useState(false); // Boolean

    return (
        <div>
            <div id="makeDomo">
                {/* When rendering domoForm, create triggerRelaod prop.
                Function calls setReloadDomos, and passes in negation of
                reload domos into the domoList */}
                <DomoForm triggerReload={() => setReloadDomos(!reloadDomos)} />
            </div>
            <div id="domos">
                <DomoList domos={[]} reloadDomos={reloadDomos} triggerReload={() => setReloadDomos(!reloadDomos)}/>
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
};

window.onload = init;