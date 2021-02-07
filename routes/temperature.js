const express = require('express');
const {authenticateJWT} = require('../utils/utils');
const router = express.Router();
const Temperature = require('../models/temperature');


router.post('/baby/:babyId', authenticateJWT, (req, res, next) => {
    const {role} = req.user;

    if (role === 'PARENT') {
        new Temperature({
            metering: [req.body],
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
        Temperature.findOne({_id: req.params.id}, (err, result) => {
            if (err) {
                res.status(500).json(err);
            } else {
                result.metering.push(req.body);
                Temperature.updateOne({_id: req.params.id},
                    {
                        $set: {
                            metering: result.metering
                        }
                    }, null, (err1) => {
                        if (err) {
                            res.status(500).json(err1);
                        }
                    }).exec().then(() => {
                    Temperature.findOne({_id: req.params.id}, (err, result) => {
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
        Temperature.findOne({baby: req.params.id}, (err, growth) => {
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



module.exports = router;
