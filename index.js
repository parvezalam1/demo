require('dotenv').config();
let express=require('express');
let app=express();
let mongoose=require('mongoose');
let authRouter=require('./routes/auth');
let usersRouter=require('./routes/users');
let postRouter=require('./routes/posts');
let catRouter=require('./routes/categories');
let cors=require('cors');
let path=require('path');
const PORT=process.env.PORT || 5000;
app.use(cors());
const multer = require('multer');
app.use("/images",express.static(path.join(__dirname+"/uploaded_images")))
app.use("/userProfile",express.static(path.join(__dirname+"/uploaded_images/userProfile")))
app.use(express.json());
// mongoose.connect('mongodb+srv://parvez_alam:8DdCuip8ODIkC8cG@cluster0.h4quu.mongodb.net/blog?retryWrites=true&w=majority',{
//     useNewUrlParser:true,
//     useUnifiedTopology:true
// }).then(console.warn('db connected')).catch((err)=>{

// console.warn(err);
// });

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(console.warn('db connected')).catch((err)=>{

console.warn(err);
});

storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'uploaded_images')
    },
    filename:function(req,file,cb){
        cb(null,req.body.name)
    }
})

const upload=multer({storage:storage})

app.use('/upload',upload.single('file'),(req,res)=>{
res.status(200).json('file has been uploaded')
})

storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'uploaded_images/userProfile')
    },
    filename:function(req,file,cb){
        cb(null,req.body.name)
    }
})

const upload2=multer({storage:storage})

app.use('/mernBackend/uploadProfile',upload2.single('file'),(req,res)=>{
res.status(200).json('profile picture has been uploaded')
})

app.use('/mernBackend/auth',authRouter);
app.use('/mernBackend/users',usersRouter);
app.use('/mernBackend/posts',postRouter);
app.use('/mernBackend/category',catRouter);
app.listen(PORT, ()=>{
    console.warn(`backend is running ${PORT}`);
})