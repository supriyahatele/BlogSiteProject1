const mongoose=require('mongoose');
const jwt = require("jsonwebtoken");
const blogsModel = require("../model/blogsModel");

const authmid = async function (req, res, next) {
  try {
    // =======================authentication=====================

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
    // req.author_Id=decodedToken.author_Id
    // let findauthorId = decodedToken.author_Id;
    next();
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }};
    // ==============================autherization==============================
    const authorise = async function (req, res, next) {
      try {
        let token = req.headers["x-api-key"];
    if (!token) {
      return res.status(400) .send({status: false,  msg: " provide the token " });
    }
        let decodedToken = jwt.verify(token, "PROJECT-FUNCTIONUP");
        console.log(decodedToken)
        if (!decodedToken) {
          return res.status(400).send({ status: false, msg: "token is invalid" });
          
        }
    let id = req.params.blogId;
    let findid = await blogsModel.findById(id);
    console.log(findid)
    let findauthorId = decodedToken.author_Id;
    let checkAuthor = findid.author_Id.toString();
    console.log(findauthorId)
    console.log(checkAuthor)
    if (checkAuthor !== findauthorId)
      return res.status(403).send({ status: false, msg: "User logged is not allowed to modifify" });  
    next();
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

module.exports.authmid = authmid;
module.exports.authorise = authorise;
