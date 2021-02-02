const express = require('express');
const {authenticateJWT} = require('../utils/utils');
const router = express.Router();
const Bebe = require('../models/bebe');

/* GET users listing. */
router.get('/', authenticateJWT, (req, res, next) => {
  const {role, id} = req.user;
  if (role === 'PARENT') {
    Bebe.find({parent: id})
    .select(" name birthday gender weight photo ")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        result: docs.map(doc => {
          return {
            name: doc.name,
            birthday: doc.birthday,
            gender: doc.gender,
            weight: doc.weight,
            photo: doc.photo,
            _id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/bebe/" + doc._id
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
  } else if (role === 'ADMIN') {
    Bebe.find()
    .select(" name birthday gender weight photo ")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        bebes: docs.map(doc => {
          return {
            name: doc.name,
            birthDay: doc.birthday,
            gender: doc.gender,
            weight: doc.weight,
            photo: doc.photo,

            request: {
              type: "GET",
              url: "http://localhost:3000/bebe/" + doc._id
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
    res.status(401);
  }
});


router.get('/:id', authenticateJWT, (req, res, next) => {
  const {role, id} = req.user;
  if (role === 'PARENT' || role === 'ADMIN') {
    Bebe.findOne({_id: req.params.id}, (err, baby) => {
      if (err) {
        res.status(400).json({
          message: 'Bad request'
        });
      } else {
        if ((baby.parent.equals(id) && role !== 'ADMIN') || role === 'ADMIN') {
          res.status(200).json(baby);
        } else {
          res.status(401).json({
            code: 'Unauthorized',
            message: 'Unauthorized'
          });
        }
      }
    });
  } else {
    res.status(401).json({
      code: 'Unauthorized',
      message: 'Unauthorized'
    });
  }
});

router.post('/', authenticateJWT, (req, res, next) => {
  const {role, id} = req.user;
  if (role === 'PARENT') {
    new Bebe({
      name: req.body.name,
      birthday: req.body.birthday,
      gender: req.body.gender,
      weight: req.body.weight,
      photo: req.body.photo,
      parent: id
    }).save()
    .then(result => {
      res.status(201).json(result);
    })
    .catch(err => {
      res.status(500).json(err);
    });
  } else {
    res.status(401);
  }
});


router.put('/:id', authenticateJWT, (req, res, next) => {
  const { role, id} = req.user;
  if (role === 'PARENT') {
    Bebe.findOne({_id: req.params.id}, (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
        Bebe.updateOne({_id: req.params.id},
            {
              $set: {
                name: req.body.name,
                birthday: req.body.birthday,
                gender: req.body.gender,
                weight: req.body.weight,
                photo: req.body.photo,
                parent: result.parent
              }
            }, null, (err1, updated) => {
              if (err) {
                res.status(500).json(err1);
              } else {
                res.status(200).json(updated);
              }
            });
      }
    });
  } else {
    res.status(401);
  }
});


router.delete('/:id', authenticateJWT, (req, res, next) => {
  const {role, id} = req.user;
  if (role === 'PARENT' || role === 'ADMIN') {
    Bebe.findOne({_id: req.params.id}, (err, baby) => {
      if (err) {
        res.status(400).json({
          message: 'Bad request'
        });
      } else {
        if ((baby.parent.equals(id) && role !== 'ADMIN') || role === 'ADMIN') {
          Bebe.remove({_id: baby._id})
          .exec()
          .then(() => {
            res.status(200).json({message: 'deleted'});
          }).catch((err) => {
            res.status(500).json(err);
          });
        } else {
          res.status(401).json({
            code: 'Unauthorized',
            message: 'Unauthorized'
          });
        }
      }
    });
  } else {
    res.status(401).json({
      code: 'Unauthorized',
      message: 'Unauthorized'
    });
  }
});

module.exports = router;
