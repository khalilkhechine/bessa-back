const express = require('express');
const {authenticateJWT} = require('../utils/utils');
const router = express.Router();
const Growth = require('../models/growth');

router.post('/baby/:babyId', authenticateJWT, (req, res, next) => {
    const {role} = req.user;

    if (role === 'PARENT') {
        new Growth({
            growthing: [req.body],
            baby: req.params.babyId
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

router.post('/:id', authenticateJWT, (req, res, next) => {
    const { role, id} = req.user;
    if (role === 'PARENT') {
        Growth.findOne({_id: req.params.id}, (err, result) => {
            if (err) {
                res.status(500).json(err);
            } else {
                result.growthing.push(req.body);
                Growth.updateOne({_id: req.params.id},
                    {
                        $set: {
                            growthing: result.growthing
                        }
                    }, null, (err1) => {
                        if (err) {
                            res.status(500).json(err1);
                        }
                    }).exec().then(() => {
                    Growth.findOne({_id: req.params.id}, (err, result) => {
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
        Growth.findOne({baby: req.params.id}, (err, growth) => {
            if (err) {
                res.status(400).json({
                    message: 'Bad request'
                });
            } else {
                res.status(200).json(growth);
            }
        });
    } else {
        res.status(401).json({
            code: 'Unauthorized',
            message: 'Unauthorized'
        });
    }
});


router.get('/baby/:id/stat/height', authenticateJWT, (req, res, next) => {
    const {role, id} = req.user;
    if (role === 'PARENT') {
        Growth.findOne({baby: req.params.id}, (err, growth) => {
            if (err) {
                res.status(400).json({
                    message: 'Bad request'
                });
            } else {
                let statHeight = [];
                if (growth && growth.growthing) {
                    statHeight = growth.growthing
                    .sort((a, b) => -(b.date - a.date))
                }
                res.status(200).json(statHeight);
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
