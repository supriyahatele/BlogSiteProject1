const mongoose=require('mongoose');
const jwt = require("jsonwebtoken");
const blogsModel = require("../model/blogsModel");

const authmid = async function (req, res, next) {
  try {
    // =======================authentication=====================

    let token = req.headers["x-api-key"];
    if (!token) {
      return res.status(400) .send({status: false,  msg: " provide the token to create a blog" });
    }
    console.log(token);
    let decodedToken = jwt.verify(token, "PROJECT-FUNCTIONUP");
    if (!decodedToken) {
      return res.status(400).send({ status: false, msg: "token is invalid" });
    }
    // ==============================autherization==============================

    let id = req.params.blogId;
    let findid = await blogsModel.findById(id);
    let findauthorId = decodedToken.author_Id;
    let checkAuthor = findid.author_Id.toString();
    if (checkAuthor !== findauthorId)
      return res.status(403).send({ status: false, msg: "User logged is not allowed to modifify" });  
    next();
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

module.exports.authmid = authmid;

