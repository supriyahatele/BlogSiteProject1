const authorModel = require("../model/authorModel");

const authors = async function(req,res){
    const author =req.body
    let authorCreated = await authorModel.create(author)
    res.send({data: authorCreated})
}


module.exports.authors = authors