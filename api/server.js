const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const authRouter = require('../auth/auth-router');
const usersRouter = require('../users/users-router');
const restricted = require('../auth/restricted-middleware');

const server = express();

//`Middleware >>>>>>>>
server.use(helmet());
server.use(express.json())
server.use(cors());

// Endpoints >>>>>>>
server.use('/api/auth', authRouter);
server.use('/api/users', restricted, checkRole('hr', usersRouter));

//  Sanity Check >>>>>>>
server.get('/', (req, res) => {
  res.json({ api: "up and at em!" });
});

module.exports = server;

function checkRole(role) {
  return (req, res, next) => {
    if (
      req.decodedToken &&
      req.decodedToken.role && 
      req.decodedToken.toLowerCase() === role
    ) {
      next();
    } else {
      res.status(403).json({ you: "got it all wrong" });
    }
  };
}
