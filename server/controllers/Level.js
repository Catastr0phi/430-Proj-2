const models = require('../models');
const Level = models.Level;

const trackerPage = (req, res) => {
    return res.render('app');
}

// Creates a level
// Used for creating custom levels from form - base levels created seperately
const makeLevel = async (req, res) => {
    if (!req.body.name || !req.body.id){
        return res.status(400).json({error: 'Level name and ID required!'});
    }

    const levelData = {
        name: req.body.name,
        id: req.body.id,
        costum: req.body.costum,
        owner: req.session.account._id,
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

// Creates a level using just a manually given name and an ID
// Used for base levels, as custom request bodies are not needed besides account info
const createBaseLevel = async (name, id, req, res) => {
    const levelData = {
        name: name,
        id: id,
        costum: false,
        owner: req.session.account._id,
    }

    try {
        const newLevel = new Level(levelData);
        await newLevel.save();
    } catch (err) {
        console.log(err);
        return res.status(500);
    }

    return res.status(200);
}

// Calls above function for every official level in the game
const createAllBaseLevels = async (req, res) => {

    // PRELUDE
    await createBaseLevel('INTO THE FIRE', '0-1', req, res);
    await createBaseLevel('THE MEATGRINDER', '0-2', req, res);
    await createBaseLevel('DOUBLE DOWN', '0-3', req, res);
    await createBaseLevel('A ONE-MACHNE ARMY', '0-4', req, res);
    await createBaseLevel('CERBERUS', '0-5', req, res);
    await createBaseLevel('SOMETHING WICKED', '0-S', req, res);

    // LIMBO
    await createBaseLevel('HEART OF THE SUNRISE', '1-1', req, res);
    await createBaseLevel('THE BURNING WORLD', '1-2', req, res);
    await createBaseLevel('HALLS OF SACRED REMAINS', '1-3', req, res);
    await createBaseLevel('CLAIR DE LUNE', '1-4', req, res);
    await createBaseLevel('THE WITLESS', '1-S', req, res);

    // LUST
    await createBaseLevel('BRIDGEBURNER', '2-1', req, res);
    await createBaseLevel('DEATH AT 20,000 VOLTS', '2-2', req, res);
    await createBaseLevel('SHEER HEART ATTACK', '2-3', req, res);
    await createBaseLevel('COURT OF THE CORPSE KING', '2-4', req, res);
    await createBaseLevel('ALL-IMPERFECT LOVE SONG', '2-S', req, res);

    // GLUTTONY
    await createBaseLevel('BELLY OF THE BEAST', '3-1', req, res);
    await createBaseLevel('IN THE FLESH', '3-2', req, res);

    // GREED
    await createBaseLevel('SLAVES TO POWER', '4-1', req, res);
    await createBaseLevel('GOD DAMN THE SUN', '4-2', req, res);
    await createBaseLevel('A SHOT IN THE DARK', '4-3', req, res);
    await createBaseLevel('CLAIR DE SOLEIL', '4-4', req, res);
    await createBaseLevel('CLASH OF THE BRANDICOOT', '4-S', req, res);

    // WRATH
    await createBaseLevel('IN THE WAKE OF POSEIDON', '5-1', req, res);
    await createBaseLevel('WAVES OF THE STARLESS SEA', '5-2', req, res);
    await createBaseLevel('SHIP OF FOOLS', '5-3', req, res);
    await createBaseLevel('LEVIATHAN', '5-4', req, res);
    await createBaseLevel('I ONLY SAY MORNING', '5-S', req, res);

    // HERESY
    await createBaseLevel('CRY FOR THE WEEPER', '6-1', req, res);
    await createBaseLevel('AESTHETICS OF HATE', '6-2', req, res);

    // VIOLENCE
    await createBaseLevel('GARDEN OF FORKING PATHS', '7-1', req, res);
    await createBaseLevel('LIGHT UP THE NIGHT', '7-2', req, res);
    await createBaseLevel('NO SOUND, NO MEMORY',  '7-3', req, res);
    await createBaseLevel('...LIKE ANTENNAS TO HEAVEN', '7-4', req, res);
    await createBaseLevel('HELL BATH NO FURY', '7-S', req, res);

    // FRAUD
    await createBaseLevel('HURTBREAK WONDERLAND', '8-1', req, res);
    await createBaseLevel('THROUGH THE MIRROR', '8-2', req, res);
    await createBaseLevel('DISINTEGRATION LOOP', '8-3', req, res);
    await createBaseLevel('FINAL FLIGHT', '8-4', req, res);
    
    // ENCORES
    await createBaseLevel('THIS HEAT, AN EVIL HEAT', '0-E', req, res);
    await createBaseLevel('...THEN FELL THE ASHES', '1-E', req, res);

    // PRIME SANCTUMS
    await createBaseLevel('SOUL SURVIVOR', 'P-1', req, res);
    await createBaseLevel('WAIT OF THE WORLD', 'P-2', req, res);
}


module.exports = {
    trackerPage,
    makeLevel,
    getLevels,
    updateTime,
    createAllBaseLevels,
}