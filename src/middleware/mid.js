const jwt = require("jsonwebtoken");

const authmid = function (req, res, next) {
  try {
    let token = req.headers["X-api-key"];
    if (!token) token = req.headers["x-api-key"];

    //If no token is present in the request header return error
    if (!token)
      return res.status(400).send({ status: false, msg: "token must be present" });

    console.log(token);
    let decodedToken = jwt.verify(token, "PROJECT-FUNCTIONUP");
    console.log(decodedToken);
    if (!decodedToken)
      return res.status(403).send({ status: false, msg: "token is invalid" });

    next();
  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
  }
};

const authorise = function (req, res, next) {
  try {
    let token = req.headers["X-api-key"];
  if(!token) token=req.headers["x-api-key"];
  let decodedToken=jwt.verify(token,"PROJECT-FUNCTIONUP");
  if (!decodedToken)
      return res.status(403).send({ status: false, msg: "token is invalid" });


    let author_ToBeModified = req.params.author_Id;
    let author_LoggedIn = decodedToken.author_Id;
    if (author_ToBeModified != author_LoggedIn)
      return res.send({
        status: false,
        msg: "Logged in author_ is not allowed to mofidy requsted author_ data",
      });
    next();
  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
  }
};

module.exports.authmid = authmid;
module.exports.authorise = authorise;
