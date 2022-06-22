const authorModel = require("../model/authorModel");

const authors = async function(req,res){
    const req.body author =
    let authorCreated = await authorModel.create(author)
    res.send({data: authorCreated})
}


module.exports.authors = authors