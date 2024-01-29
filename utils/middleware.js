const logger = require("./logger");
const User = require("../models/user");
const jwt = require('jsonwebtoken');

const requestLogger = (req, res, next) => {
  logger.info("Method: ", req.method);
  logger.info("Path: ", req.path);
  logger.info("Body: ", req.body);

  next();
};

const unknownEndpoint = (req, res, next) => {
  res.status(404).send({ message: ":/" });
};

const errorHandler = (error, req, res, next) => {
  logger.error(error.name);
  if (error.name === "CastError") {
    res.status(400).send({ message: "send good id" });
  } else if (error.name === "MongooseError") {
    res.status(400).send({ message: "can't connect to Mongoose" });
  } else if (error.name === "JsonWebTokenError"){
    res.status(400).send({ message: "Send json web token." });
  }

  next(error);
};

const getTokenFrom = (req) => {
  const auth = req.get("Authorization");
  console.log(auth);

  if (auth && auth.startsWith("Bearer ")) {
    return auth.replace("Bearer ", "");
  }

  return null;
};

const tokenExtractor = async (req, res, next) => {
  const token = getTokenFrom(req);
  if (!token){
    return res.status(401).json({message: "no token provided"})
  }
  const decodedToken = await jwt.verify(token, process.env.SECRET);

  if (!decodedToken.id) {
    return res.status(401).json({ message: "Invalid token" });
  }
  const user = await User.findById(decodedToken.id);
  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  req.user = user;
  next();
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor
};
