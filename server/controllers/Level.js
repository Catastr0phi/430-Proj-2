const models = require('../models');
const Level = models.Level;

const makeLevel = async (req, res) => {
    if (!req.body.name || !req.body.id){
        return res.status(400).json({error: 'Level name and ID required!'});
    }

    const levelData = {
        name: req.body.name,
        id: req.body.id,
        costum: req.body.costum,
    };

    // Time does not need to be added at creation, but can be
    if (req.body.time){
        levelData.time = req.body.time;
    }

    try {
        const newLevel = new Level(levelData);
        await newLevel.save();
        return res.status(201).json({name: newLevel.name, id: newLevel.id});
    } catch (err) {
        console.log(err);
        if (err.code === 11000){
            return res.status(400).json({error: 'Level already exists!'});
        }
        return res.status(500).json({error: 'An error occured making level'});
    }
}

const getLevels = async (req, res) => {
    try {
        const query = {owner: req.session.account._id};
        const docs = await Level.find(query).select('name id custom time').lean().exec();

        return res.json({levels: docs});
    } catch (err) {
        console.log(err);
        return res.status(500).json({error: 'Error retrieving levels!'});
    }
};

const updateTime = async (req, res) => {
    if (!req.body.time){
        return res.status(400).json({error: 'Time requried!'});
    }
    try {
        const query = {owner: req.session.account._id, name: req.body.name};
        const update = {time: req.body.time};

        await Level.findOneAndUpdate(query, update);

        // findOneAndUpdate returns the data BEFORE the update, so doc must be gotten seperately after
        const doc = Level.findOne(query);
        return res.status(201).json({name: doc.name, id: doc.id, time: doc.time});
    } catch (err) {
        console.log(err);
        return res.status(500).json({error: 'Error updating time!'});
    }
}

module.exports = {
    makeLevel,
    getLevels,
    updateTime,
}