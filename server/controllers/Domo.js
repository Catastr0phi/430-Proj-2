const models = require('../models');
const Domo = models.Domo;

const makerPage = (req, res) => {
    return res.render('app');
}

const makeDomo = async (req, res) => {
    if (!req.body.name || !req.body.status || !req.body.age){
        return res.status(400).json({error: 'All fields are required!'});
    }

    const domoData = {
        name: req.body.name,
        status: req.body.status,
        age: req.body.age,
        owner: req.session.account._id,
    };

    try {
        const newDomo = new Domo(domoData);
        await newDomo.save();
        return res.status(201).json({name: newDomo.name, status: newDomo.status, age: newDomo.age});
    } catch (err) {
        console.log(err);
        if (err.code === 11000){
            return res.status(400).json({error: 'Domo already exists!'});
        }
        return res.status(500).json({error: 'An error occured making demo'});
    }
}

const getDomos = async (req, res) => {
    try {
        const query = {owner: req.session.account._id};
        const docs = await Domo.find(query).select('name status age').lean().exec();

        return res.json({domos: docs});
    } catch (err) {
        console.log(err);
        return res.status(500).json({error: 'Error retrieving domos!'});
    }
};

const updateStatus = async (req, res) => {
    if (!req.body.status){
        return res.status(400).json({error: 'New status required!'});
    }
    try {
        const query = {owner: req.session.account._id, name: req.body.name};
        const update = {status: req.body.status};

        await Domo.findOneAndUpdate(query, update);

        // findOneAndUpdate returns the data BEFORE the update, so doc must be gotten seperately after
        const doc = Domo.findOne(query);
        return res.status(201).json({name: doc.name, status: doc.status, age: doc.status});
    } catch (err) {
        console.log(err);
        return res.status(500).json({error: 'Error updating status!'});
    }
}

module.exports = {
    makerPage,
    makeDomo,
    getDomos,
    updateStatus,
}