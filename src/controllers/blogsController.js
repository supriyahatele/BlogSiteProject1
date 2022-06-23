const blogsModel = require("../model/blogsModel");
const authorModel = require("../model/authorModel");
const mongoose = require("mongoose");

//=============================================[validation function]================================================
const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

const isValidObjectId = function (ObjectId) {
  return mongoose.Types.ObjectId.isValid(ObjectId); //reference
};

const isValidRequestquery = function (requestquery) {
  return Object.keys(requestquery).length > 0;
};

const isValidString = function (value) {
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

//========================================================[create blog]===================================================
const blogs = async function (req, res) {
  try {
    let data = req.body; //data come from body

    if (!Object.keys(data).length)
      return res.status(400).send({ status: false, msg: "Please Provide Valid Blog Details" });

    if (!isValid(data.title))
      return res.status(400).send({ status: false, msg: "Title is Required" });

    if (!isValid(data.body))
      return res.status(400).send({ status: false, msg: "Body is Required" });

    if (!isValid(data.author_Id))
      return res
        .status(400)
        .send({ status: false, msg: "AuthorId is Required" });

    let AuthorData = await authorModel.findById(data.author_Id);

    if (!AuthorData)
      return res
        .status(404)
        .send({ status: false, msg: "No such authorId found" });

    if (!isValidString(data.tags))
      return res.status(400).send({ status: false, msg: "tags is Required" });

    if (!isValid(data.category))
      return res
        .status(400)
        .send({ status: false, msg: "Category is Required" });

    if (!isValidString(data.subcategory))
      return res
        .status(400)
        .send({ status: false, msg: "SubCategory is Required" });

    let blogCreate = await blogsModel.create(data);

    res
      .status(201)
      .send({
        status: true,
        msg: "Blog Created Sucessfully",
        data: blogCreate,
      });
  } catch (err) {
    res.status(500).send({ status: "failed", message: err.message });
  }
};

//==============================================[get blog]====================================
const getBlogs = async function (req, res) {
  try {
    const filterQuery = { isDeleted: false, isPublished: true };
    const queryParams = req.query;

    if (isValidRequestquery(queryParams)) {
      const { author_Id, category, tags, subCategory } = queryParams;

      if (isValid(author_Id) && isValidObjectId(author_Id)) {
        filterQuery["author_Id"] = author_Id;
      }

      if (queryParams.hasOwnProperty("category")) {
        if (!isValid(category)) {
          return res
            .status(400)
            .send({
              status: false,
              message: " Blog category should be in valid format",
            });
        }
        filterQuery["category"] = category;
      }

      // If tags and subcategory are an array then validating each element
      if (queryParams.hasOwnProperty("tags")) {
        if (Array.isArray(tags)) {
          for (let i = 0; i < tags.length; i++) {
            if (!isValid(tags[i])) {
              return res
                .status(400)
                .send({
                  status: false,
                  message: " Blog tags must be in valid format",
                });
            }
            filterQuery["tags"] = tags[i];
          }
        } else {
          if (!isValid(tags)) {
            return res
              .status(400)
              .send({
                status: false,
                message: " Blog tags must be in valid format",
              });
          }
          filterQuery["tags"] = tags;
        }
      }

      if (queryParams.hasOwnProperty("subCategory")) {
        if (Array.isArray(subCategory)) {
          for (let i = 0; i < subCategory.length; i++) {
            if (!isValid(subCategory[i])) {
              return res
                .status(400)
                .send({
                  status: false,
                  message: " Blog subcategory is not valid",
                });
            }
            filterQuery["subCategory"] = subCategory[i];
          }
        } else {
          if (!isValid(subCategory)) {
            return res
              .status(400)
              .send({
                status: false,
                message: " Blog subcategory is not valid",
              });
          }
          filterQuery["subCategory"] = subCategory.trim();
        }
      }

      const blogs = await blogsModel.find(filterQuery);

      if (Array.isArray(blogs) && blogs.length === 0) {
        return res
          .status(404)
          .send({ status: false, message: "no such blog found" });
      }
      res.status(200).send({ status: true, message: "Blog List", data: blogs });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "failed", message: err.message });
  }
};
//===========================================================================
const deleteblog = async function (req, res) {
  try {
    let blogId = req.params.blogId;
    let blog = await blogsModel.findById(blogId);
    if (!blog) {
      return res.status(404).send("No such blog exists");
    }
    
    let deleteBlog = await blogsModel.findOneAndUpdate(
      { _id: blogId },
      { $set: { isDeleted: true, deletedAt: Date.now() } },
      { new: true }
    );
    res.status(201).send({ status: false, data: deleteBlog });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};
//==============================================[update Blog]=====================================================//
const updateBlog = async function (req, res) {
  try {
    let data = req.body;
    let blog_Id = req.params.blogId;

    if (!Object.keys(data).length)
      return res
        .status(400)
        .send({ status: false, msg: "input can't be empty" });

    if (!isValidString(data.title))
      return res.status(400).send({ status: false, msg: "tags is Required" });

    if (!isValidString(data.body))
      return res.status(400).send({ status: false, msg: "body is Required" });

    if (!isValidString(data.subCategory))
      return res
        .status(400)
        .send({ status: false, msg: "SubCategory is Required" });
    if (data.subCategory) {
      let subCategory = data.subCategory.split(",").map((x) => x.trim());
      data.subCategory = subCategory;
    }

    if (!isValidString(data.tags))
      return res.status(400).send({ status: false, msg: "tags is Required" });
    if (data.tags) {
      let tags = data.tags.split(",").map((x) => x.trim());
      data.tags = tags;
    }

    let checkBlog = await blogsModel.findById(blog_Id);

    if (!checkBlog)
      return res.status(404).send({ status: false, msg: "Blog Not Found" });

    if (checkBlog.isDeleted == true)
      return res
        .status(400)
        .send({ status: false, msg: "This blog is already Deleted" });

    let update = await blogsModel.findByIdAndUpdate(
      blog_Id,

      {
        $push: { tags: data.tags, subCategory: data.subCategory },
        title: data.title,
        body: data.body,
        isPublished: true,
        publishedAt: new Date(),
      },

      { new: true }
    );

    res.status(200).send({ status: true, data: update });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

//==============================================================[delete query]======================================================
const deleteQuery = async function (req, res) {
  try {
    let category = req.query.category;
    let author_Id = req.query.author_Id;
    let tags = req.query.tags;
    let subCategory = req.query.subCategory;
    let ispublished = req.query.ispublished;
    
    if (!author_Id)
      return res.status(400).send({ status: false, msg: "please provide author id" });
    let AuthorData = await authorModel.findById(data.author_Id);
    if (!AuthorData)
      return res.status(404).send({ status: false, msg: "No such authorId found" });
    let deletedData = await blogsModel.findOneAndUpdate(
      {
        category: category,
        author_Id: author_Id,
        tags: tags,
        subCategory: subCategory,
        isPublished: ispublished,
      },
      { isDeleted: true },
      { new: true }
    );
    if (!deletedData)
      return res.status(404).send({ status: false, msg: "No blog found!" });
    res.status(200).send({ status: true, blog: deletedData });
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};
module.exports.blogs = blogs;
module.exports.getBlogs = getBlogs;
module.exports.deleteblog = deleteblog;
module.exports.deleteQuery = deleteQuery;
module.exports.updateBlog = updateBlog;
