let router=require('express').Router();
let category=require('../models/category');


//create categories

router.post('/',async (req,res)=>{
let newCategory= new category(req.body);
let category2=await newCategory.save();
res.status(200).json(category2);
});


//get All categories

router.get('/',async (req,res)=>{
    let cat=await category.find({});
    res.status(201).json(cat)
})
module.exports=router;
