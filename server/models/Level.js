const mongoose = require('mongoose');
//const _ = require('underscore');

const LevelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    id: {
        type: String,
        required: true,
        trim: true,
    },
    custom: {
        type: Boolean,
        required: true,
        default: false,
    },
    time: {
        type: Number,
        required: false,
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Account',
    },
    updatedDate: {
        type: Date,
        default: Date.now,
    },
})

LevelSchema.statics.toAPI = (doc) => ({
    name: doc.name,
    id: doc.id,
    custom: doc.custom,
    time: doc.time,
});

const LevelModel = mongoose.model('Level', LevelSchema);
module.exports = LevelModel;