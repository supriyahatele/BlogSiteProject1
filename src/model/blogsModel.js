 const mongoose = require('mongoose');
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
   tags:[],
    category:{
        type:String,
        required:true
    },
    subCategory:[],
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

 