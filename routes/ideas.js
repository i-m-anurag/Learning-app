const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();


//Load idea model
require('../models/Idea');
const Idea = mongoose.model('ideas');



router.get('/',(req,res)=>{
    Idea.find({})
    .then(
        ideas => {
            Idea.find({})
            res.render('ideas/index-idea',{
                ideas:ideas
            });
            
        }
    );
    

});


router.get('/add', (req, res) => {
    res.render('ideas/add');
});

//Add ideas 
router.post('/',(req,res)=>{
    let errors=[];
    if(!req.body.title){
        errors.push({text:'Please add a title'});
    }
    if (!req.body.details) {
        errors.push({ text: 'Please add a details' });
    }
    if(errors.length>0){
        res.render('ideas/add',{
            errors:errors,
            title:req.body.title,
            details:req.body.details
            

        });
    }
        else{
            const newUser = {
                title:req.body.title,
                details:req.body.details
            }
            new Idea(newUser)
            .save()
            .then(idea => {
                res.redirect('/ideas');
            })

        }

  

} );

//Edit idea
router.get('/edit/:id',(req,res)=>{
    Idea.findOne({
       _id:req.params.id
    })
    .then(idea => {
        res.render('ideas/edit',{
            idea:idea
        });
    });
});

//Edit form put request

router.put('/:id',(req,res)=>{
    Idea.findOne({
        _id:req.params.id
    })
    .then(idea => {
        idea.title=req.body.title;
        idea.details=req.body.details;
        idea.save()
        .then(idea=>{
            res.redirect('/ideas/');
        })
    });
});

//Delete
router.delete('/:id',(req,res)=>{
    Idea.remove({_id:req.params.id})
    .then(()=>{
        res.redirect('/ideas/')
    });
});




module.exports = router;