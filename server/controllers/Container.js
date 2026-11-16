const models = require('../models');
const Container = models.Container;

const makerPage = async (req, res) => {
    return res.render('app');
}

const makeDomo = async (req, res) => {
    if (!req.body.name || !req.body.age || !req.body.peopleEaten) {
        return res.status(400).json({ error: 'Name, age, and people eaten are required!' });
    }

    const domoData = {
        name: req.body.name,
        age: req.body.age,
        peopleEaten: req.body.peopleEaten,
        owner: req.session.account._id,
    };

    try {
        const newDomo = new Domo(domoData);
        await newDomo.save();
        return res.status(201).json({
            name: newDomo.name, age: newDomo.age,
            peopleEaten: newDomo.peopleEaten
        }); // Domo successfully created 
    } catch (err) {
        console.log(err);
        if (err.code === 110000) {
            return res.status(400).json({ error: 'Domo already exists!' });
        }
        return res.status(500).json({ error: "An error occured making the domo!" });
    }
}

const getDomos = async (req, res) => {
    try {
        const query = { owner: req.session.account._id };
        const docs = await Domo.find(query).select('name age peopleEaten').lean().exec();

        return res.json({ domos: docs });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving domos!' });
    }
}

// Removes a domo by a provided ID
const removeDomo = async (req, res) => {
    const id = req.body.id;
    try {
        await Domo.findByIdAndDelete(id).then(() => res.json({}))
    } catch(err){
        console.log(err);
        return res.status(400).json({error: 'Could not delete Domo.'});
    }
};

module.exports = {
    makerPage,
    makeDomo,
    getDomos,
    removeDomo,
};