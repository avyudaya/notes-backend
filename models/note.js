const mongoose = require('mongoose');

const noteSchema = mongoose.Schema({
    content: String,
    important: Boolean,
    user: {
        ref: 'User',
        type: mongoose.Schema.Types.ObjectId,
    }
})

noteSchema.set('toJSON', {
    transform: (document, returnedDocument) => {
        returnedDocument.id = returnedDocument._id.toString();

        delete returnedDocument._id;
        delete returnedDocument.__v;
    }
})


module.exports = mongoose.model('Note', noteSchema);