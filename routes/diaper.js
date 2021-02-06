const express = require('express');
const {authenticateJWT} = require('../utils/utils');
const router = express.Router();
const Diaper = require('../models/diaper');

router.post('/', authenticateJWT, (req, res, next) => {
    const {role} = req.user;

    if (role === 'PARENT') {
        const period = req.body.period ? req.body.period : 6;
        const nextDate = new Date(req.body.createdAt);
        nextDate.setHours( nextDate.getHours() + period )
        new Diaper({
            createdAt: req.body.createdAt,
            period: period,
            usedDiaper: [{usedDate: nextDate}],
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


router.put('/:id', authenticateJWT, (req, res, next) => {
    const { role, id} = req.user;
    if (role === 'PARENT') {
        Diaper.findOne({_id: req.params.id}, (err, result) => {
            if (err) {
                res.status(500).json(err);
            } else {
                const nextDate = result.usedDiaper.length > 0 ? result.usedDiaper[result.usedDiaper.length - 1].usedDate : result.createdAt;
                nextDate.setHours( nextDate.getHours() + req.body.period )
                result.usedDiaper.push({usedDate: nextDate});
                Diaper.updateOne({_id: req.params.id},
                    {
                        $set: {
                            period: req.body.period,
                            usedDiaper: result.usedDiaper
                        }
                    }, null, (err1) => {
                        if (err) {
                            res.status(500).json(err1);
                        }
                    }).exec().then(() => {
                    Diaper.findOne({_id: req.params.id}, (err, result) => {
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
        Diaper.findOne({baby: req.params.id}, (err, babyBottle) => {
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
