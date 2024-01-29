const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: String,
    name: String,
    passwordHash: String,
    notes: [
        {
            ref: 'Note',
            type: mongoose.Schema.Types.ObjectId,
        }
    ]
})

userSchema.set('toJSON', {
    transform: (document, returnedDocument) => {
        returnedDocument.id = returnedDocument._id.toString();

        delete returnedDocument._id;
        delete returnedDocument.__v;
        delete returnedDocument.passwordHash;
    }
})

module.exports = mongoose.model('User', userSchema);