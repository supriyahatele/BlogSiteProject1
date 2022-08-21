const express = require('express');
const router = express.Router();
const authorController= require("../controllers/authorController")
const blogsController= require("../controllers/blogsController")
const mid = require("../middleware/mid")

//================author api====================
router.post("/authors",authorController.authors) 
router.post("/login",authorController.authorLogin)

//================blog api====================
router.post("/blogs",mid.authmid,blogsController.blogs)
router.get("/blogs",mid.authmid,blogsController.getBlogs)
router.delete("/blogs/:blogId",mid.authmid,blogsController.deleteblog)
router.delete("/blogs",mid.authmid,blogsController.deleteQuery)
router.put("/blogs/:blogId",mid.authmid,blogsController.updateblogs)
router.post("/login",authorController.authorLogin)
//=====================================================

module.exports = router;
