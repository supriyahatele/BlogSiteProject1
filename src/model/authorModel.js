const mongoose = require('mongoose');


const authorSchema = new mongoose.Schema( {
  title:{
    type:String,
    required:true,
    enum:["Mr","Mrs","Miss"],
    trim:true
  },
  fName:{
    type:String,
    required:true,
    trim:true
  },
  lName:{
    type:String,
    required:true,
    trim:true
  },

  email:{
    type:String,
    required:true,
    unique:true,
    trim:true
    
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    
   }, { timestamps: true });

module.exports = mongoose.model('author', authorSchema)