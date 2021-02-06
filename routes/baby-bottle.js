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
    .then(result => {
      res.status(201).json(result);
    })
    .catch(err => {
      res.status(500).json(err);
    });
  } else {
    res.status(401).json({message: 'Unauthorized'})
  }
});

module.exports = router;
