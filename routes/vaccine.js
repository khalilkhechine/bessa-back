const express = require('express');
const {authenticateJWT} = require('../utils/utils');
const router = express.Router();
const Vaccine = require('../models/vaccine');

router.post('/', authenticateJWT, (req, res, next) => {
    const {role} = req.user;

    if (role === 'PARENT') {
        const period = req.body.period ? req.body.period : 6;
        const nextDate = new Date(req.body.createdAt);
        nextDate.setDate( nextDate.getDate() + period )
        new Vaccine({
            name: req.body.name,
            createdAt: req.body.createdAt,
            vaccineDates: [{vaccineDate: nextDate}],
            period: req.body.period,
            description: req.body.description,
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


router.get('/baby/:id', authenticateJWT, (req, res, next) => {
    const {role, id} = req.user;
    if (role === 'PARENT') {
        Vaccine.find({baby: req.params.id}, (err, vaccine) => {
            if (err) {
                res.status(400).json({
                    message: 'Bad request'
                });
            } else {
                res.status(200).json(vaccine);
            }
        });
    } else {
        res.status(401).json({
            code: 'Unauthorized',
            message: 'Unauthorized'
        });
    }
});


router.put('/:id', authenticateJWT, (req, res, next) => {
    const { role, id} = req.user;
    if (role === 'PARENT') {
        Vaccine.findOne({_id: req.params.id}, (err, result) => {
            if (err) {
                res.status(500).json(err);
            } else {
                const nextDate = result.vaccineDates.length > 0 ? result.vaccineDates[result.vaccineDates.length - 1].vaccineDate : result.createdAt;
                nextDate.setDate( nextDate.getDate() + req.body.period )
                result.vaccineDates.push({vaccineDate: nextDate});
                Vaccine.updateOne({_id: req.params.id},
                    {
                        $set: {
                            name: req.body.name,
                            createdAt: req.body.createdAt,
                            vaccineDates: result.vaccineDates,
                            period: req.body.period,
                            description: req.body.description,
                        }
                    }, null, (err1) => {
                        if (err) {
                            res.status(500).json(err1);
                        }
                    }).exec().then(() => {
                    Vaccine.findOne({_id: req.params.id}, (err, result) => {
                        res.status(200).json(result);
                    });
                });
            }

        });
    } else {
        res.status(401);
    }
});


module.exports = router;
