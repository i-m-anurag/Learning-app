const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();


//Load model
require('../models/User');
const User = mongoose.model('users');

//Register route
router.get('/register',(req,res)=>{
    res.render('users/register');
});


//Login route
router.get('/login', (req, res) => {
    res.render('users/login');
});

//Register User Post req
router.post('/register',(req,res)=>{
    let errors = [];
    if(req.body.password != req.body.password2)
    {
        errors.push({text:'Password do not match'});
    }
    if(req.body.password.length < 4)
    {
        errors.push({text:'Password must be at least 4 characters'});
    }
    if(errors.length >0)
    {
        res.render('users/register',{
            errors:errors,
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            password2:req.body.password2
        });
    }
    else{
        User.findOne({email:req.body.email})
        .then(user => {
            if(user)
            {  
                console.log("email already exist");
                res.redirect('/user/register');
            }
            else{
                const newUser = new User({
                    name:req.body.name,
                    email:req.body.email,
                    password:req.body.password
                });
                bcrypt.genSalt(10,(err,salt)=>{
                    bcrypt.hash(newUser.password,salt,(err,hash)=>{
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                        .then(user=>{
                            res.redirect('/user/login');
                        })
                        .catch(err => {
                            console.log(err);
                            return;
                        });
                    });
                });
            }
        });
    }
});

//login post request
router.post('/login',(req,res,next)=>{
  
    passport.authenticate('local',{
        successRedirect:'/ideas',
        failureRedirect:'users/login',
        failureFlash:true
    })(req,res,next);
});

//Logout 
router.get('/logout',(req,res)=>{
    req.logOut();
    res.redirect('/user/login');
})

module.exports = router;