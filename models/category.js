let mongoose=require('mongoose');
let categorySchema=new mongoose.Schema({
category:{
    type:String,
    required:true,
    unique:true
}
},
{timestamps:true}
);
module.exports=mongoose.model('categories',categorySchema);