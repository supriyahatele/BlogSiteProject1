const authorModel = require("../model/authorModel");
const jwt = require("jsonwebtoken");

const authors= async function (req, res) {
    try{
        let {title,fName,lName,email,password}=req.body
        if(!title){
            return res.status(400).send({status:false,message:"author title is required"})
        }
        if(!fName){ 
            return res.status(400).send({status:false,message:"author first name is required"})
        }
        if(!lName){
            return res.status(400).send({status:false,message:"author last name is required"})
        }
        if(!email){
            return res.status(400).send({status:false,message:"author email is required"})
        }
        if (!/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email)) {
            res.status(400).send({status: false,message: `Email should be a valid email address`});
        }
    
        if(!password){
            return res.status(400).send({status:false,message:"author password is required"})
        }
    
        if (!/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(password)) {
            res.status(400).send({status: false,message: `Email should be a valid email address`});
        }
            let authorCreated =await authorModel.create(req.body)
            res.status(201).send({status:true,date:authorCreated, msg:"created"}) 
        
        }catch (err)
        {
            return res.status(500).send({status:false,msg:err.message})
        }
    
};

const authorLogin = async function (req, res) {
    try {
      const { email, password } = req.body
  
      if (!email && password) return res.status(400).send({ status: false, msg: "All fields are required" });
  
      let authorData = await authorModel.findOne({ email: email });
  
      if (!authorData) return res.status(400).send({ status: false, msg: "Bad request" });
  
      let token = jwt.sign(
        {
          authorId: authorData._id.toString(),
          expiredate: "30d"
        },
        "PROJECT-FUNCTIONUP"   // SECRET KEY
      );
      res.setHeader("x-auth-token", token);       
      res.status(201).send({ status: true, token: token });
    } catch (error) {
      res.status(500).send({ status: false, msg: error.message });
    }
  }
module.exports.authors = authors
module.exports.authorLogin = authorLogin