const mongoose=require('mongoose');
const jwt = require("jsonwebtoken");
const blogsModel = require("../model/blogsModel");


    // =======================authentication=====================
    
const authmid = async function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];
    if (!token) {
      return res.status(400) .send({status: false,  msg: " please provide the token" });
    }
    // console.log(token);
    let decodedToken = jwt.verify(token, "PROJECT-FUNCTIONUP");
    console.log(decodedToken)
    if (!decodedToken) {
      return res.status(400).send({ status: false, msg: "token is invalid" });
      
    }
    req.decodedToken=decodedToken
    
    next();
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }};

    

module.exports.authmid = authmid;

