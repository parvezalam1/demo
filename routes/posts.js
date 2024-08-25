let router=require('express').Router();
const { compare } = require('bcrypt');
const lowerCase=require('lower-case');
let Post=require('../models/post');
let fs=require('fs');

//create post

router.post('/',async (req,res)=>{
    if(await Post.findOne({title:req.body.title})){
        res.status(200).json('title_match');

    }else if(await Post.findOne({description:req.body.description})){
        res.status(200).json('desc_match');
    }else{
        let newPost=new Post(req.body);
let post=await newPost.save();
res.status(200).json(post);
    }
 
 


});

//update post

router.put('/:postId',async (req,res)=>{
    let post=await Post.findById(req.params.postId);
    let path=`./uploaded_images/${post.photo}`;
if(post.username===req.body.username){
    if(req.body.photo){
        if(fs.existsSync(path)){
            await fs.unlinkSync('./uploaded_images/'+post.photo)
        }
        
    }
try{
await Post.findByIdAndUpdate(req.params.postId,{
    $set:req.body
})
res.status(200).json('post update successfully');
}catch(err){
    res.status(400).json(err);
}
}
else{
res.status(201).json('you can only update your account post');
}
});

//delete post


router.delete('/:delId',async(req,res)=>{
    let post=await Post.findById(req.params.delId);
    let path=`./uploaded_images/${post.photo}`;

if(post.username===req.body.username){
try{    
    if(fs.existsSync(path)){

        await fs.unlinkSync('./uploaded_images/'+post.photo)
    }
    await post.delete()
    res.status(200).json(1);
}catch(err){
res.status(201).json(2);
}
}else{
    console.log("not found")
res.status(201).json(0);
}
});

//get by user id post

router.get('/:id',async(req,res)=>{
try{
let getAllPosts=await Post.findById(req.params.id);
res.status(200).json(getAllPosts);
}catch(err){
    res.status(400).json(err);
}
});

//get All by username or category

router.post('/pa',async(req,res)=>{
let username= await req.query.username;
let category=await req.query.category;
let limit=4;
let skip=req.body.offset*limit;
try{
let posts;
let allPost;
if(username){
posts=await Post.find({username});
}
else if(category){
    posts=await Post.find({cateogry});
}else{
    allPost=await Post.find();
    posts=await Post.find({}).limit(limit).skip(skip);
}
res.status(200).json([posts,Math.ceil(allPost.length/limit)]);
}catch(err){
    res.status(400).json(err);
}
});

router.post('/title',async(req,res)=>{
    try{
        let posts=await Post.find();
        let temp=posts.filter(item=>{
             if(item.title.toLowerCase().indexOf(req.body.title.toLowerCase())!==-1){
                 return item;
                 }
        })
        res.status(200).json(temp);
    }catch(err){
        res.status(400).json(err);
    }
    });

module.exports=router;

