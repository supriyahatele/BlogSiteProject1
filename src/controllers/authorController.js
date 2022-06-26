const authorModel = require("../model/authorModel");
const jwt = require("jsonwebtoken");

// ========================================[create-author]====================================================================

const authors= async function (req, res) {
  try{
     let data=req.body

    if (Object.keys(data).length === 0) return res.status(400).send({ msg: "please provide sufficient data " })

    if(!data.title ||typeof data.title!=="string" ){
        return res.status(400).send({status:false,message:"author title is required"})
    }
      if(data.title!=="Mr"){
      if(data.title!=="Miss"){
      if(data.title!=="Mrs"){
      return res.status(400).send({status:false,message:"Should be Mr , Miss , Mrs"})
       } } }

    if(!data.fName ){
     return res.status(400).send({status:false,message:"author first name is required"})
    }

    if(!/^[a-zA-Z]{2,}$/.test(data.fName)){
        return res.status(400).send({status:false,message:"first name is not in right format"})
    }
    if(!data.lName ){
      return res.status(400).send({status:false,message:"author last name is required"})
    }
    if(!/^[a-zA-Z]{2,}$/.test(data.lName)){
       return res.status(400).send({status:false,message:" last name is not in right format "})
    }
    if(!data.email){
      return res.status(400).send({status:false,message:" email is required"})
    }
    if (!/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/.test(data.email)) {
      return res.status(400).send({status: false,message: "invalid emailId"});
    }

    if(!data.password){
        return res.status(400).send({status:false,message:" password is required"})
    }
 
    if(!/^(?=.[A-Za-z])(?=.\d)[A-Za-z\d]{8,}$/.test(data.password)) {
      return res.status(400).send({status: false,message: "password dosent match with formate"});
    }
       let authorCreated =await authorModel.create(req.body)
       return res.status(201).send({status:true,date:authorCreated, msg:"created"}) 

    }
    catch (err) {
      res.status(500).send({error: err.message})
    }
  };


// =======================================authorLogin=============================================================

const authorLogin = async function (req, res) {
    try {
      const { email, password } = req.body
      if(!email){
        return res.status(400).send({status:false,message:"plz provide email "})
      }
      if(!password){
      return res.status(400).send({status:false,message:"plz provide password "})
      }
      let authorData = await authorModel.findOne({ email: email, password:password });
  
      if (!authorData) return res.status(400).send({ status: false, msg: "Bad request",msg:"user not found" });
  
      let token = jwt.sign(
        {
          author_Id: authorData._id.toString(), //payload
          expiredate: "30d"
        },
        "PROJECT-FUNCTIONUP"   // SECRET KEY
      );
      res.setHeader("x-api-key", token);       
      res.status(201).send({ status: true, token: token, msg:"login successfull" });
     } catch (error) {
      res.status(500).send({ status: false, msg: error.message });
     }
    }


module.exports.authors = authors
module.exports.authorLogin = authorLogin