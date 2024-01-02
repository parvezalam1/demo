const { modelName } = require('../models/users');

let routes=require('express').Router();
let User=require('../models/users');

let bcrypted=require('bcrypt');



// //register


routes.post('/register',async (req,res)=>{
    let salt= await bcrypted.genSalt(10);
let hashPass=await bcrypted.hash(req.body.password,salt);
try{
 
    let newUser=new User({
        username:req.body.username,
        email:req.body.email,
        password:hashPass
    
    });
    const users2=await newUser.save();
    res.status(200).json(users2);
    
}
catch(err){
    res.status(500).json(err);
}
});


//login
routes.post('/login',async (req,res)=>{
    try{
        let user=await User.findOne({username:req.body.username})
        !user && res.status(401).json('Username is incurrect')
        let passwordValidate=await bcrypted.compare(req.body.password,user.password)
        !passwordValidate && res.status(401).json('Password is incurrect');
        const {password,...others}=user._doc;
        res.status(200).json(others)
        res.end();
    }
    catch(err){
        fes.status(500).json(err)
    }
})







// routes.post('/login', async (req,res)=>{
// try{
//  let user= await User.findOne({username:req.body.username});
//     // res.status(400).json(user.email)
//  if(user){
// if( await bcrypted.compare(req.body.password,user.password)){
//     res.status(200).json(user);
// }else{
//     res.status(400).json('password is incurrect');
// }
//  }else{
//     res.status(400).json('username is incurrect');
//  }

// //     throw err2;
// // console.log(result)
// // res.status(200).json(result)

// }catch(err){
// console.log(err.message)
// }

//     // let user= await User.findOne({username:req.body.username})
//     // !user &&  res.status(400).json("your username is incurrect");
//     // let validate= await bcrypted.compare(req.body.password,user.password)
//     // !validate && res.status(400).json("your password is incurrect");
//     // const {password,...others}=user._doc;
//     // res.status(200).json(others)

// })

module.exports=routes;

