const express = require('express');
const {authenticateJWT} = require('../utils/utils');
const router = express.Router();
const BabyBottle = require('../models/baby-bottle');

router.post('/', authenticateJWT, (req, res, next) => {
  const {role} = req.user;

  if (role === 'PARENT') {
    const period = req.body.period ? req.body.period : 4;
    const nextDate = new Date(req.body.createdAt);
    nextDate.setHours( nextDate.getHours() + period )
    new BabyBottle({
      createdAt: req.body.createdAt,
      period: period,
      tokenBabyBottle: [{tokenDate: nextDate}],
      baby: req.body.baby
    }).save()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch(err => {
      res.status(500).json(err);
    });
  } else {
    res.status(401).json({message: 'Unauthorized'})
  }
});

router.put('/:id', authenticateJWT, (req, res, next) => {
  const { role, id} = req.user;
  if (role === 'PARENT') {
    BabyBottle.findOne({_id: req.params.id}, (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
        const nextDate = result.tokenBabyBottle.length > 0 ? result.tokenBabyBottle[result.tokenBabyBottle.length - 1].tokenDate : result.createdAt;
        nextDate.setHours( nextDate.getHours() + req.body.period )
        result.tokenBabyBottle.push({tokenDate: nextDate});
        BabyBottle.updateOne({_id: req.params.id},
            {
              $set: {
                period: req.body.period,
                tokenBabyBottle: result.tokenBabyBottle
              }
            }, null, (err1) => {
              if (err) {
                res.status(500).json(err1);
              }
            }).exec().then(() => {
          BabyBottle.findOne({_id: req.params.id}, (err, result) => {
            res.status(200).json(result);
          });
        });
      }

    });
  } else {
    res.status(401);
  }
});

router.get('/baby/:id', authenticateJWT, (req, res, next) => {
  const {role, id} = req.user;
  if (role === 'PARENT') {
    BabyBottle.findOne({baby: req.params.id}, (err, babyBottle) => {
      if (err) {
        res.status(400).json({
          message: 'Bad request'
        });
      } else {
          res.status(200).json(babyBottle);
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
