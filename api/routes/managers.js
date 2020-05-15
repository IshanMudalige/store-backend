const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');

router.get('/', (req, res, next) => {
    User.find({isManager:true})
        .exec()
        .then(doc => {
            res.status(201).json({
                message: doc
            });
        })
        .catch(er => {
            res.status(500).json({
                error: er
            })
        });

});

//--- manager signup ----
router.post('/signup', (req, res, next) => {

    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if(user.length > 0){
                return res.status(500).json({
                    message: 'Already registered, try another email address'
                });
            }else{
                bcrypt.hash(req.body.password, 10, function(err, hash) {
                    // Store hash in your password DB.
                    if(err){
                        return res.status(500).json({
                            error: err
                        });
                    }else{
                        const manager = new User({
                            _id: new mongoose.Types.ObjectId(),
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            email: req.body.email,
                            isManager:true,
                            password: hash,
                            createdAt: new Date().toISOString()
                        });

                        manager.save()
                            .then(doc => {
                                res.status(201).json({
                                    message: 'Manager Registered Successfully'
                                });
                            })
                            .catch(er => {
                                res.status(500).json({
                                    error: er
                                });
                            });
                    }
                });
            }
        })



});

module.exports = router;