const mongoose = require('mongoose');
const validator = require('validator')

const authorSchema = new mongoose.Schema( {
  fName:{
    type:String,
    required:true
  },
  lName:{
    type:String,
    required:true
  },
  title:{
    type:String,
    required:true,
    enum:["Mr","Mrs","Miss"]
  },
  email:{
    type:String,
    required:true,
    unique:true,
    validate:{
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email',
      isAsync: false
    }
    },
    password:{
        type:String,
        required:true,
    },
    
   }, { timestamps: true });

module.exports = mongoose.model('author', authorSchema)