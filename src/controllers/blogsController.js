const blogsModel = require("../model/blogsModel");
const authorModel = require("../model/authorModel");
const mongoose = require("mongoose");



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
  }l
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
const stringChecking = function (data) {
  if (typeof data !== 'string') {
    return false;
  } else if (typeof data === 'string' && data.trim().length == 0) {
    return false;
  } else {
    return true;
  }
}
const isValidString = function (value) {
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

const updateBlog = async function (req, res) {
   try {
    let data = req.body;
    let blogId = req.params.blogId;

    if (!Object.keys(data).length) return res.status(400).send({ status: false, msg: "input can't be empty" });

    if (!stringChecking(data.title)) return res.status(400).send({ status: false, msg: "title is Required" });
    if (!/^[A-Za-z][^\.:]*[\.:?]$/.test(data.title)) return res.status(400).send({ status: false, msg: "Title  is not in right format" }) 
    if (!/^[A-Za-z][^\.:]*[\.:?]$/.test(data.body)) return res.status(400).send({ status: false, msg: "Body isnot in right format" })


    if (!stringChecking(data.body)) return res.status(400).send({ status: false, msg: "body is Required" });

    if (!stringChecking(data.subCategory)) return res.status(400).send({ status: false, msg: "SubCategory is Required" });

    if (!stringChecking(data.tags)) return res.status(400).send({ status: false, msg: "tags is Required" });
     
    
     let checkBlog = await blogsModel.findById(blogId);
    

    if (!checkBlog)
      return res.status(404).send({ status: false, msg: "Blog Not Found" });

    if (checkBlog.isDeleted == true)
      return res.status(400).send({ status: false, msg: "This blog is already Deleted" });

    let update = await blogsModel.findByIdAndUpdate(blogId, { $push: { tags: data.tags, subCategory: data.subCategory }, title: data.title, body: data.body, isPublished: true, publishedAt: Date.now() }, { new: true });

    res.status(200).send({ status: true, msg:"updated successfully",data: update });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};
 




//==============================================================[delete query]=================================================================
const deleteQuery = async function (req, res) {
   try {
    let author_Id = req.query.author_Id;
    let category = req.query.category;
    let tags = req.query.tags;
    let subcategory = req.query.subcategory;
    let filter = {}
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

    if (subcategory != undefined) {
      if (!stringChecking(subcategory))
        return res.status(400).send({ status: false, msg: "Please enter the subcategory in right format...!" });
      filter.subcategory = subcategory
    }

    filter.isDeleted = false
    filter.isPublished = true
    console.log(filter)
    
    let filterData = await blogsModel.findOneAndUpdate({ filter },
      {$set:{ isDeleted: true }},
       { new: true })
        if (!filterData) {
      return res.status(404).send({ status: false, msg: "Documents not found.." });
    }
    res.status(200).send({ status: true,msg:"deleted data by query successfully", Data: filterData });
  }
   catch (err) {
    res.status(500).send({ status: false, msg: "Error", error: err.message });
  }
}
module.exports.blogs = blogs;
module.exports.getBlogs = getBlogs;
module.exports.deleteblog = deleteblog;
module.exports.deleteQuery = deleteQuery;
module.exports.updateBlog = updateBlog;


// const updateblog= async function(req,res){
// const data = req.body
// const blogId= req.params.blogId
// const blog = await blogsModel.findById(blogId)
// if (blog){
//     if(blog.isDeleted===false){
//         if (blog.isPublished===false){
//             const updatedate= await blogsModel.findOneAndUpdate({
//                 _id:blogId },{$set:{isPublished: true,publishedAt:Date.now()}},{new:true})

//         const blogData= await  blogsModel.findOneAndUpdate({_id:blogId},{...data},{new:true})
//         return res.status(200).send({status:true, data:blogData})}
//         else {
//             return res.status(404).send({status:false,msg:"blog not found"})
//         }
//     } else {
//         res.status(404).send({status:false, msg:" blog id not found"})
//     }
// }

//}
// if (data.subCategory) {
    //   let subCategory = data.subCategory.split(",").map((x) => x.trim());  
    //   data.subCategory = subCategory;
    //   console.log(subCategory);
    // }
     // if (data.tags) {
    //   let tags = data.tags.split(",").map((x) => x.trim());
    //   data.tags = tags;
    // }


    //=========
    // let author_ToBeModified =checkBlog.author_Id;
    // let author_LoggedIn = req.authoridtoken;
    // //console.log(author_LoggedIn)
    // console.log(author_ToBeModified)
    // if (author_ToBeModified != author_LoggedIn)
    //   return res.send({
    //     status: false,
    //     msg: "Logged in author_ is not allowed to mofidy requsted author_ data",
    //   });