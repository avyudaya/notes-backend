const express = require('express');
const cors = require('cors');
const app = express();
const noteRouter = require('./controllers/notes');
const userRouter = require('./controllers/users');
const logger = require('./utils/logger');
const config = require('./utils/config');
const mongoose = require('mongoose');
const {requestLogger, unknownEndpoint, errorHandler, tokenExtractor} = require('./utils/middleware');

mongoose.set('strictQuery', true);
mongoose.connect(config.MONGO_URI)
    .then(() => logger.info('Connected to mongodb'))
    .catch(err => logger.error(err.message));

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.get('/', (req, res) => {
    res.end('Welcome to my application');
})

app.use("/api/users", userRouter);
app.use("/api/notes", noteRouter);

app.use(errorHandler);
app.use(unknownEndpoint);
module.exports = app;