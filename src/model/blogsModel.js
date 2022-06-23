 const mongoose = require('mongoose');
const { required } = require('nodemon/lib/config');
const ObjectId= mongoose.Schema.Types.ObjectId;


const blogsSchema = new mongoose.Schema( {
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    author_Id:{
        type:ObjectId,
        ref:"author"
    },
   tags:{
       type : [] ,
       required:true
    }
       ,
    category:{
        type:String,
        required:true,
        unique: true
    },
    subCategory:
    {type:[],
        require:true},
    isDeleted:{
        type:Boolean,
        default:false
    },
    isPublished:{
        type:Boolean,
        default:false
    },
    
}, { timestamps: true });

module.exports = mongoose.model('blog', blogsSchema)

 