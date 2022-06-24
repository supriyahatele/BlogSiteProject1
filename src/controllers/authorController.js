const authorModel = require("../model/authorModel");
const jwt = require("jsonwebtoken");

const authors= async function (req, res) {
  try{
    let data=req.body
    if (Object.keys(data).length === 0) return res.status(400).send({ msg: "please provide sufficient data " })

    if(!data.title || typeof data.title!=="string"){
        return res.status(400).send({status:false,message:"author title is required"})
    }
    if(data.title!=="Mr"){
      if(data.title!=="Miss"){
        if(data.title!=="Mrs"){
          return res.status(400).send({status:false,message:"Should be Mr , Miss , Mrs"})
        } 
      } 
     }
    if(!data.fName || typeof data.fName!=="string"){
        return res.status(400).send({status:false,message:"author first name is required"})
    }
    if(!data.lName ||typeof data.lName!=="string" ){
        return res.status(400).send({status:false,message:"author last name is required"})
    }
    if(!data.email ||data.email==""){
        return res.status(400).send({status:false,message:"author email is required"})
    }
    if (!/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/.test(data.email)) {
        res.status(400).send({status: false,message: "invalid emailId"});
    }

    if(!data.password){
        return res.status(400).send({status:false,message:"author password is required"})
    }
    if (!/^(?=.?[A-Z])(?=.?[a-z])(?=.?[0-9])(?=.?[#?!@$%^&*-]).{8,}$/.test(data.password)) {
        res.status(400).send({status: false,message: "Not  a strong password "});
    }
        let authorCreated =await authorModel.create(req.body)
        res.status(201).send({status:true,date:authorCreated, msg:"created"}) 
    
    }
    catch (err) {
      res.status(500).send({error: err.message})
    }
    
};

const authorLogin = async function (req, res) {
    try {
      const { email, password } = req.body
  
      if (!email && password) return res.status(400).send({ status: false, msg: "All fields are required" });
  
      let authorData = await authorModel.findOne({ email: email, password:password });
  
      if (!authorData) return res.status(400).send({ status: false, msg: "Bad request" });
  
      let token = jwt.sign(
        {
          authorId: authorData._id.toString(), //payload
          expiredate: "30d"
        },
        "PROJECT-FUNCTIONUP"   // SECRET KEY
      );
      res.setHeader("x-api-key", token);       
      res.status(201).send({ status: true, token: token });
    } catch (error) {
      res.status(500).send({ status: false, msg: error.message });
    }
  }
module.exports.authors = authors
module.exports.authorLogin = authorLogin