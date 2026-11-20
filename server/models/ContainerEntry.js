const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

// Validates that a provided string matches the hex format
// Validator code found at:
// https://stackoverflow.com/questions/25822289/what-is-the-best-way-to-store-color-hex-values-in-mongodb-mongoose
const colorValidator = (v) =>(/^#([0-9a-f]{3}){1,2}$/i).test(v);

// Defines an Entry Schema which contains:
//  - a type(task, event, or note)
//  - content
//  - color
//  - parentContainer
//  - owner
//  - createdDate
const EntrySchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['task', 'event', 'note'],
        default: 'task',
    },
    content: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        set: setName,
    },
    color: {
        type: String,
        required: true,
        trim:true,
        uppercase: true,
        validate: [colorValidator, 'Invalid Color'],
    },
    parentContainer: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Container',
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Account',
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
});

// Defines a container object which holds a name,
// color, owner, and createdDate
const ContainerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        set: setName,
    },
    color: { 
        type: String, // Hex
        required: true,
        trim: true,
        uppercase: true,
        validate: [colorValidator, 'Invalid color'],
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Account',
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
});

EntrySchema.statics.toAPI = (doc) => ({
    type: doc.type,
    content: doc.content,
    color: doc.color, 
});

ContainerSchema.statics.toAPI = (doc) => ({
    name: doc.name,
    color:  doc.color,
});

const EntryModel = mongoose.model('Entry', EntrySchema);
const ContainerModel = mongoose.model('Container', ContainerSchema);
module.exports = {
    EntryModel,
    ContainerModel,
};