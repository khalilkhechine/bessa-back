const utils = require("../utils/utils");
const jwt = require('jsonwebtoken');
const User = require("../models/user");
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

router.post('/login', (req, res) => {
  // Read email and password from request body
  const {email, password} = req.body;

  // Filter user from the users array by email and password
  User.findOne({email: email}, (err, user) => {
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          // Generate an access token
          const accessToken = jwt.sign(
              {
                id: user._id,
                email: user.email,
                role: user.role
              },
              utils.accessTokenSecret);

          res.json({
            accessToken
          });
        } else {
          res.status(401).json({
            code: 'Unauthorized',
            message: 'Email or password incorrect'
          });
        }
      });
    }  else {
      res.status(401).json({
        code: 'Unauthorized',
        message: 'Unauthorized'
      });
    }
  });
});

router.post('/register', (req, res) => {
  const {name, email, password, gender} = req.body;
  bcrypt.hash(password, utils.saltRounds, function (err, hash) {
    User.create({
      name: name,
      email: email,
      password: hash,
      gender: gender,
      role: 'PARENT'
    }).then(function (data) {
      if (data) {
        res.json(data).status(204);
      } else {
        res.json(
            {
              code: 'Server error',
              message: 'unable to create user'
            }
        ).status(400);
      }
    });
  });
});

module.exports = router;
