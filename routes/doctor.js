const express = require('express');
const {authenticateJWT} = require('../utils/utils');
const router = express.Router();
const Doctor = require('../models/doctor');

router.post('/', authenticateJWT, (req, res, next) => {
    const {role} = req.user;

    if (role === 'PARENT') {
        new Doctor({
            name: req.body.name,
            email: req.body.email,
            address: req.body.address,
            speciality: req.body.speciality,
            appointments: [],
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
        Doctor.find({baby: req.params.id}, (err, vaccine) => {
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


router.post('/:id/appointment', authenticateJWT, (req, res, next) => {
    const { role, id} = req.user;
    if (role === 'PARENT') {
        Doctor.findOne({_id: req.params.id}, (err, result) => {
            if (err) {
                res.status(500).json(err);
            } else {
                result.appointments.push(req.body)
                Doctor.updateOne({_id: req.params.id},
                    {
                        $set: {
                            appointments: result.appointments,
                        }
                    }, null, (err1) => {
                        if (err) {
                            res.status(500).json(err1);
                        }
                    }).exec().then(() => {
                    Doctor.findOne({_id: req.params.id}, (err, result) => {
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
