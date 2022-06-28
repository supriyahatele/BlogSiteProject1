const express = require('express');
const router = express.Router();
const authorController= require("../controllers/authorController")
const blogsController= require("../controllers/blogsController")
const mid = require("../middleware/mid")


router.post("/authors",authorController.authors) 
router.post("/blogs",mid.authmid,blogsController.blogs)
router.get("/blogs",mid.authmid,blogsController.getBlogs)
router.delete("/blogs/:blogId",mid.authmid,mid.authorise,blogsController.deleteblog)
router.delete("/blogs",mid.authmid,blogsController.deleteQuery)
router.put("/blogs/:blogId",mid.authmid,mid.authorise,blogsController.updateBlog)
router.post("/login",authorController.authorLogin)


module.exports = router;
