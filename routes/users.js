const express = require('express');
const {authenticateJWT} = require('../utils/utils');
const router = express.Router();
const User = require('../models/user');

/* GET users listing. */
router.get('/', authenticateJWT, (req, res, next) => {
  const {role} = req.user;
  if (role === 'ADMIN') {
    User.find()
    .select(' name email gender ')
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        users: docs.map(doc => {
          return {
            name: doc.name,
            email: doc.email,
            gender: doc.gender,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/user/' + doc._id
            }
          };
        })
      };

      res.status(200).json(response);

    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
  } else {
    res.json({
      code: 'Unauthorized',
      message: 'Unauthorized'
    }).status(401);
  }
});

router.get('/:id', authenticateJWT, (req, res) => {
  const {id, role} = req.user;
  if (id === req.params.id || role === 'ADMIN') {
    User.findOne({_id: req.params.userId},
        (err, user) => {
          if (!user) {
            return res.status(404).json({status: false, message: 'User record not found.'});
          } else {
            return res.status(200).json({
              status: true,
              user: {name: user.name, email: user.email, gender: user.gender}
            });
          }
        }
    );
  } else {
    res.json({
      code: 'Unauthorized',
      message: 'Unauthorized'
    }).status(401);
  }
});

router.put('/:id', authenticateJWT, (req, res) => {
  User.findOneAndUpdate(
      {'_id': req.params.id}, req.body, {new: true},
      (err, result) => {
        if (err) {
          res.json(err).status(400);
        }
        res.send(result).status(200);
      });
});

router.delete('/:id', authenticateJWT, (req, res) => {
  const {role} = req.user;
  if (role === 'ADMIN') {
    User.remove({_id: req.params.userId})
    .exec()
    .then(result => {
      res.status(200).json({
        message: "User deleted"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
  } else {
    res.json({
      code: 'Unauthorized',
      message: 'Unauthorized'
    }).status(401);
  }
});

module.exports = router;
