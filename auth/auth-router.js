const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const restricted = require("../auth/restricted-middleware");

const { jwtSecret } = require("../config/secrets");
const Users = require("../Users/users-model");

//  CRUD endpoints beginning with /api/auth

//  POST >>>>>>>
//  create new user
router.post("/register", (req, res) => {
  let user = req.body;

  Users.add(user)
    .then(saved => {
      req.session.loggedIn = true;
      res.status(201).json({ message: "User successfully added to db" });
    })
    .catch(err => {
      res.status(500).json(err);
    });
});
//  login a user
router.post("/login", (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);
        res.status(200).json({ message: `Welcome ${user.username}`, token });
      } else {
        res.status(400).json({ message: "Invalid Credentials" });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});
//  Create token for user upon login
function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
    role: user.role || "user"
  };

  const options = {
    expiresIn: "1h"
  };

  return jwt.sign(payload, jwtSecret, options);
}

//  GET >>>>>>>>
//  find users list
router.get("/", restricted, (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});
//  kill the session
router.get("/", restricted, (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catche(err => res.send(err));
});

module.exports = router;
