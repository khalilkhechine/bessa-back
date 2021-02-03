const express = require('express');
const {authenticateJWT} = require('../utils/utils');
const router = express.Router();
const BabyBottle = require('../models/baby-bottle');

router.post('/', authenticateJWT, (req, res, next) => {
  const {role} = req.user;

  if (role === 'PARENT') {
    new BabyBottle({
      createdAt: req.body.createdAt,
      period: req.body.period ? req.body.period : 4,
      tokenBabyBottle: req.body.tokenBabyBottle,
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
