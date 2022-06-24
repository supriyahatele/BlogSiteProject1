 const mongoose = require('mongoose');
const { required } = require('nodemon/lib/config');
const ObjectId= mongoose.Schema.Types.ObjectId;


const blogsSchema = new mongoose.Schema( {
    title:{
        type:String,
        required:true,
        trim:true
    },
    body:{
        type:String,
        required:true,
        trim:true
    },
    author_Id:{
        type:ObjectId,
        ref:"author",
        trim:true
    },
   tags:{
       type : [] ,
       required:true,
       trim:true
    }
       ,
    category:{
        type:String,
        required:true,
        trim:true
    },
    subCategory:
    {type:[],
        require:true,
        trim:true},

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

 