const mongoose = require('mongoose');
const validator = require('validator')

const authorSchema = new mongoose.Schema( {
  title:{
    type:String,
    required:true,
    enum:["Mr","Mrs","Miss"]
  },
  fName:{
    type:String,
    required:true
  },
  lName:{
    type:String,
    required:true
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