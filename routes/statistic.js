const express = require('express');
const {authenticateJWT} = require('../utils/utils');
const router = express.Router();
const Growth = require('../models/growth');


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


module.exports = router;
