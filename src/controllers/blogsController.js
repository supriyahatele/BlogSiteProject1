const blogsModel = require("../model/blogsModel");
const authorModel = require("../model/authorModel");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");



//========================================================[create blog]=================================================================
const blogs = async function (req, res) {
  try {
    let data = req.body 

    if (Object.keys(data).length === 0) return res.status(400).send({ status: false, msg: "Please Provide Valid Blog Details" })

    if (!data.title ||typeof data.title!=="string") return res.status(400).send({ status: false, msg: "title is Required" })

    if (!/^[A-Za-z][^\.:]*[\.:]$/.test(data.title)) return res.status(400).send({ status: false, msg: "Title  is not in right format" })

    if (!data.body ||typeof data.body!=="string") return res.status(400).send({ status: false, msg: "body is Required" })

    if (!/^[A-Za-z][^\.:]*[\.:]$/.test(data.body)) return res.status(400).send({ status: false, msg: "Body isnot in right format" })

    if (!data.author_Id ||typeof data.author_Id!=="string") return res.status(400).send({ status: false, msg: "AuthorId is Required" })

    let AuthorData = await authorModel.findById(data.author_Id)

    if (!AuthorData) return res.status(404).send({ status: false, msg: "No such author found" })

    if (!data.tags ) return res.status(400).send({ status: false, msg: "tags is Required" })

    if (!(data.category ||typeof data.author_Id!=="string")) return res.status(400).send({ status: false, msg: "Category is Required" })

    if(!/^[a-zA-Z]+$/.test(data.category)) return res.status(400).send({ status: false, msg: "Category  is not in right format" })

    if (!data.subCategory ||typeof data.author_Id!=="string") return res.status(400).send({ status: false, msg: "SubCategory is Required" })
    
    let blogCreate = await blogsModel.create(data)

    res.status(201).send({ status: true, msg: "Blog Created Sucessfully", data: blogCreate })

  } catch (err) {
    res.status(500).send({ status: "failed", message: err.message });
  }
};

//==============================================[get blog]=======================================================================

let getBlogs = async function (req, res) {
  try {
    let filterBlog = req.query;
    if (!filterBlog) return res.status(404).send({ status: false, Error: "please set query" })
    let data = await blogsModel.find({
      $and: [{ isDeleted: false, isPublished: true }, filterBlog],
    });
    if (data.length === 0) return res.status(404).send({ status: false, msg: "Blog not found! " });

    res.status(200).send({ status: true, msg: "get blog Sucessfully" ,data: data });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};
//===================================================[delete params]===========================================================
const deleteblog = async function (req, res) {
  try {
    let blogId = req.params.blogId;
   
    let blog = await blogsModel.findById(blogId);
    if (!blog) {
      return res.status(404).send("No such blog exists");
    }
    if (blog.isDeleted == true) return res.status(400).send({ status: false, msg: "this blog is already deleted" })

    let deleteBlog = await blogsModel.findOneAndUpdate(
      { _id: blogId },
      { $set: { isDeleted: true, deletedAt: Date.now() } },
      { new: true }
    );
    res.status(201).send({ status: true, data: deleteBlog, msg:"deleted successfully"});
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

//==============================================[update Blog]=====================================================//

const isValidString = function (value) {
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

const updateBlog = async function (req, res) {

  try {

    let data = req.body 
    let blog_Id = req.params.blogId 

    if (!Object.keys(data).length) return res.status(400).send({ status: false, msg: "input can't be empty" })
    
    if (!isValidString(data.title)) return res.status(400).send({ status: false, msg: "tags is Required" })

    if (!isValidString(data.body)) return res.status(400).send({ status: false, msg: "body is Required" })

    if (!isValidString(data.subCategory)) return res.status(400).send({ status: false, msg: "SubCategory is Required" })
    if (!isValidString(data.tags)) return res.status(400).send({ status: false, msg: "tags is Required" })
    
    
    let checkBlog = await blogsModel.findById(blog_Id)  

    if(!checkBlog)return res.status(404).send({ status: false, msg: "Blog Not Found" })

    if (checkBlog.isDeleted == true) return res.status(400).send({ status: false, msg: "This blog is already Deleted" })
  

      let update = await blogsModel.findByIdAndUpdate(blog_Id,

      { $push:{tags:data.tags,subCategory:data.subCategory},title:data.title,body:data.body,isPublished: true, publishedAt: new Date()  },
      
      { new: true })
   
    res.status(200).send({ status: true, data: update })

  }
  
  catch (err) {
    res.status(500).send({ error: err.message });
  }
};
 




//==============================================================[delete query]=================================================================
const stringChecking = function (data) {
  if (typeof data !== 'string') {
    return false;
  } else if (typeof data === 'string' && data.trim().length == 0) {
    return false;
  } else {
    return true;
  }
}
const deleteQuery = async function (req, res) {

   try {
    // let filter = req.query;
    
    // if (!filter) return res.status(404).send({ status: false, Error: "please set query" })
    let {category,subCategory,tags}=req.query
    let filter={}
    
    
    if (category != undefined) {
      if (!stringChecking(category))
        return res.status(400).send({ status: false, msg: "Please enter the category in right format...!" })
        filter.category = category
    }
     if (tags != undefined) {
      if (!stringChecking(tags))
        return res.status(400).send({ status: false, msg: "Please enter the tag in right format...!" });
        filter.tags = tags
    } 

    if (subCategory != undefined) {
      if (!stringChecking(subCategory))
        return res.status(400).send({ status: false, msg: "Please enter the subcategory in right format...!" });
        filter.subCategory = subCategory
    }
    let decodedToken=req.decodedToken;
   
    let variable=await blogsModel.find({$and: [{author_Id:decodedToken.author_Id},filter]})
    if(variable.length==0)
    return res.status(404).send({ status: false, msg: "Not authorise" });
    filter.isDeleted = false
    filter.isPublished = true
    let filterData = await blogsModel.findOneAndUpdate( filter, {$set:{ isDeleted: true }, deletedAt: new Date()}, { new: true })
     
      if (!filterData){
      return res.status(404).send({ status: false, msg: "Documents not found.." });
     }
    res.status(200).send({ status: true,msg:"deleted data by query successfully", Data: filterData });
  }
   catch (err) {
    res.status(500).send({ status: false, msg: "Error", error: err.message });
  }
};


module.exports.blogs = blogs;
module.exports.getBlogs = getBlogs;
module.exports.deleteblog = deleteblog;
module.exports.deleteQuery = deleteQuery;
module.exports.updateBlog = updateBlog;

