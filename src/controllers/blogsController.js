const blogsModel = require("../model/blogsModel");
const authorModel = require("../model/authorModel");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const isValidObjectId = function (objectId) {
  return mongoose.Types.ObjectId.isValid(objectId)
}

//========================================================[create blog]=================================================================
const blogs = async function (req, res) {
  try {
    let data = req.body 

    if (Object.keys(data).length === 0) return res.status(400).send({ status: false, msg: "Please Provide Valid Blog Details" })

    if (!data.title ||typeof data.title!=="string") return res.status(400).send({ status: false, msg: "title is Required" })
    data.title = data.title.trim().split(" ").filter(word => word).join(" ");

    if (!data.body ||typeof data.body!=="string") return res.status(400).send({ status: false, msg: "body is Required" })
    data.body = data.body.trim().split(" ").filter(word => word).join(" ");
  
    if (!data.author_Id ||typeof data.author_Id!=="string") return res.status(400).send({ status: false, msg: "AuthorId is Required" })

    let AuthorData = await authorModel.findById(data.author_Id)

    if (!AuthorData) return res.status(404).send({ status: false, msg: "No such author found" })

    if (!data.tags ) return res.status(400).send({ status: false, msg: "tags are Required" })

    if (!(data.category ||typeof data.author_Id!=="string")) return res.status(400).send({ status: false, msg: "Category is Required" })

    if(!/^[a-zA-Z]+$/.test(data.category)) return res.status(400).send({ status: false, msg: "Category  is not in right format" })

    if (!data.subCategory) return res.status(400).send({ status: false, msg: "SubCategory is Required" })
    
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
let filter ={ }
    
let {author_Id,category,tags,subCategory}=filterBlog

if(isValidObjectId(author_Id)){
  filter.author_Id=author_Id
}
if(stringChecking(category)){
  filter.category=category
}
if(stringChecking(tags)){
 
  let tagsArry = tags.trim().split(',').map(tag => tag.trim());
                filter['tags'] = { $all: tagsArry }
}
if(stringChecking(subCategory)){
  
  let subCategoryArry = subCategory.trim().split(',').map(tag => tag.trim());
                filter['subCategory'] = { $all: subCategoryArry }
}

let data = await blogsModel.find({
         $and: [{ isDeleted: false, isPublished: true }, filter],
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
    if(!isValidObjectId(blogId)) return res.status(400).send({ status: false, msg: "plx enter valid blogid" })
   
    let blog = await blogsModel.findById(blogId);
    //authorization
    if(blog.author_Id!=req.decodedToken.author_Id) return res.status(403).send({status:false,msg:"not authorized"})
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
  if (typeof value != "string" ) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};
const updateblogs = async function (req, res) {

  try {

    let data = req.body 
    let blog_Id = req.params.blogId 

    if (!Object.keys(data).length) return res.status(400).send({ status: false, msg: "input can't be empty" })
    
    if (!isValidString(data.title)) return res.status(400).send({ status: false, msg: "tags is Required" })

    if (!isValidString(data.body)) return res.status(400).send({ status: false, msg: "body is Required" })

    if (!data.subCategory) return res.status(400).send({ status: false, msg: "SubCategory is Required" })
    if (!data.tags)return res.status(400).send({ status: false, msg: "tags is Required" })
    
    
    let checkBlog = await blogsModel.findById(blog_Id)  
  //authorization
    if(checkBlog.author_Id!=req.decodedToken.author_Id) return res.status(403).send({status:false,msg:"not authorized"})
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
  if ( data == 'undefined'||data == 'undefined') return false;
  if (typeof data !== 'string') return false;
  if (typeof data == 'string' && data.trim().length == 0) return false;
    return true; 
}
const deleteQuery = async function (req, res) {

   try {
    
    let {category,subCategory,tags}=req.query
    let filter={}
    
    if (category) {
      if (!stringChecking(category))
        return res.status(400).send({ status: false, msg: "Please enter the category in right format...!" })
        filter.category = category
    }
     if (tags) {
      if (!stringChecking(tags))
        return res.status(400).send({ status: false, msg: "Please enter the tag in right format...!" });
        filter.tags = tags
    } 

    if (subCategory) {
      if (!stringChecking(subCategory))
        return res.status(400).send({ status: false, msg: "Please enter the subcategory in right format...!" });
        filter.subCategory = subCategory
    }
    filter.isDeleted = false
    filter.isPublished = true
    let decodedToken=req.decodedToken;
   //authorization
    let variable=await blogsModel.find({$and: [{author_Id:decodedToken.author_Id},filter]})
    if(variable.length==0)
    return res.status(404).send({ status: false, msg: "Not authorise" });
    
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
module.exports.updateblogs = updateblogs;



