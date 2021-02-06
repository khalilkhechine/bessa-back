const express = require('express');
const {authenticateJWT} = require('../utils/utils');
const router = express.Router();
const diaper = require('../models/diaper');

router.post('/', authenticateJWT, (req, res, next) => {
    const {role} = req.user;

    if (role === 'PARENT') {
        const period = req.body.period ? req.body.period : 6;
        const nextDate = new Date(req.body.createdAt);
        nextDate.setHours( nextDate.getHours() + period )
        new diaper({
            createdAt: req.body.createdAt,
            period: period,
            usedDiaper: [{tokenDate: nextDate}],
            selectedBebe: req.body.selectedBebe
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
