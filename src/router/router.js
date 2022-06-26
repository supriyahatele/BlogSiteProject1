const express = require('express');
const router = express.Router();
const authorController= require("../controllers/authorController")
const blogsController= require("../controllers/blogsController")
const mid = require("../middleware/mid")


router.post("/authors",authorController.authors) 
router.post("/blogs",blogsController.blogs)
router.get("/blog",blogsController.getBlogs)
router.delete("/blogs/:blogId",mid.authmid,blogsController.deleteblog)
router.delete("/blogs",mid.authmid,blogsController.deleteQuery)
router.put("/blogs/:blogId",mid.authmid,blogsController.updateBlog)
router.post("/createblog",authorController.authorLogin)
//router.delete("/blog",blogsController.getBlogs)

module.exports = router;
