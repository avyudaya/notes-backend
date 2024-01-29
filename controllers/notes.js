const noteRouter = require("express").Router();
const Note = require("../models/note");
const {tokenExtractor} = require('../utils/middleware');

noteRouter.get("/", (req, res) => {
  Note.find({}).then((notes) => res.json(notes));
});

noteRouter.get("/:id", (req, res, next) => {
  Note.findById(req.params.id)
    .then((note) => {
        if(note){
            res.json(note);
        } else {
            res.status(404).end();
        }
    })
    .catch(error => next(error));
});

noteRouter.post("/", tokenExtractor, async (req, res, next) => {
  const {content, important} = req.body;

  if(content === undefined){
    res.status(400).json({'message': 'Missing content'});
  }

  const note = new Note({
    content: content,
    important: important || false,
    user: req.user._id,
  });

  note.save()
    .then(note => {
      res.json(note);
    })
    .catch(error => next(error));
});

noteRouter.delete('/:id', async (request, response) => {
  await Note.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

noteRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

module.exports = noteRouter;
