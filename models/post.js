let mongoose=require('mongoose');
let postsSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
        required:true,
        unique:true
    },
    photo:{
        type:String,
        required:false
    },
    username:{
        type:String,
        required:true
    },
    categories:{
        type:Array,
        required:false
    }

},
{timestamps:true}
);
module.exports=mongoose.model('posts',postsSchema);