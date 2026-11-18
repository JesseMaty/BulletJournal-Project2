const models = require('../models');
const Entry = models.Entry;

const makerPage = async (req, res) => {
    return res.render('container');
}

const makeEntry = async (req, res) => {
    if (!req.body.type || !req.body.content || !req.body.color) {
        return res.status(400).json({ error: 'Type, content, color, and parent are all required!' });
    }

    const entryData = {
        type: req.body.type,
        content: req.body.content,
        color: req.body.color,
        parentContainer: req.session.account._id,
        owner: req.session.account._id,
    };

    try {
        const newEntry = new Entry(entryData);
        await newEntry.save();
        return res.status(201).json({
            type: newEntry.type, content: newEntry.content,
            color: newEntry.color, parentContainer: newEntry.parentContainer,
        }); // Entry successfully created 
    } catch (err) {
        console.log(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Entry already exists!' });
        }
        return res.status(500).json({ error: "An error occured making the entry!" });
    }
}

const getEntries = async (req, res) => {
    try {
        const query = { owner: req.session.account._id };

        // If a parent container is provided, filter through that
        // Otherwise get all entries owned by account
        //if (req.query.parentContainer) 
        //    {query.parentContainer = req.query.parentContainer;}

        const docs = await Entry.find(query).select('').lean().exec();

        return res.json({ entries: docs });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving entries!' });
    }
}

const updateEntryContent = async (req, res) => {
    // Make sure new content is filled out
    if (!req.body.id || !req.body.content) {
        return res.status(400).json({ error: 'Entry id and content required!' });
    }

    try {
        await Entry.update({ id: req.body.id, content: req.body.content });
        return res.status(204);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error updating entry content' });
    }
}

// Moves an entry to a new parent container
const moveEntry = async (req, res) => {
    const entryId = req.body.id;
    const containerId = req.body.parentContainer;

    try {
        const query = { id: entryId }
        await Entry.update(query, { parentContainer: containerId })

        return res.status(200).json({message: 'Successfully Moved Entry'});
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Could not move Entry' });
    }
}

// Removes an entry by a provided ID
const removeEntry = async (req, res) => {
    const id = req.body.id;
    try {
        await Entry.findByIdAndDelete(id);
        return res.status(200).json({message: 'Successfully Removed Entry'});;
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Could not delete Entry.' });
    }
};

module.exports = {
    makerPage,
    makeEntry,
    getEntries,
    updateEntryContent,
    moveEntry,
    removeEntry,
};