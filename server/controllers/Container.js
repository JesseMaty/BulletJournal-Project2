const models = require('../models');
const Container = models.Container;
const Entry = models.Entry;

const makerPage = async (req, res) => {
    return res.render('container');
}

const makeContainer = async (req, res) => {
    if (!req.body.name || !req.body.color) {
        return res.status(400).json({ error: 'Name and color are both required!' });
    }

    const containerData = {
        name: req.body.name,
        color: req.body.color,
        owner: req.session.account._id,
    };

    try {
        const newContainer = new Container(containerData);
        await newContainer.save();
        return res.status(201).json({
            name: containerData.name,
            color: containerData.color,
            owner: containerData.owner,
        }); // Container successfully created 
    } catch (err) {
        console.log(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Container already exists!' });
        }
        return res.status(500).json({ error: "An error occured making the container!" });
    }
}

const getContainers = async (req, res) => {
    try {
        const query = { owner: req.session.account._id };
        const docs = await Container.find(query).select('').lean().exec();

        return res.json({ containers: docs });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving containers!' });
    }
}

const updateContainerName = async (req, res) => {
    // Make sure new name is filled out
    if (!req.body.id || !req.body.name) {
        return res.status(400).json({ error: 'Container id and name required!' });
    }

    try {
        await Entry.update({ id: req.body.id, name: req.body.name });
        return res.status(204).json({ id: 'Successfully updated Container content' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error updating Container content' });
    }
}


// Removes a container, AND it's child entries
const removeContainer = async (req, res) => {
    const id = req.body.id; // Id of the container to remove
    try {
        await Container.findByIdAndDelete(id);

        try {
            const query = { owner: req.session.account._id, parentContainer: id };
            const entries = await Entry.find(query).select('').lean().exec();

            entries.forEach(entry => {
                entries.findByIdAndDelete(entry._id);
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ error: 'Could not delete the Container\'s Entries' });
        }

        return res.status(204).json({ id: "Successfully deleted Container and it's children" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Could not delete Container.' });
    }
};

module.exports = {
    makerPage,
    makeContainer,
    getContainers,
    updateContainerName,
    removeContainer,
};