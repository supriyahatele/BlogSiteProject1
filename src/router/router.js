const express = require('express');
const router = express.Router();
const authorController= require("../controllers/authorController")
const blogsController= require("../controllers/blogsController")
const mid = require("../middleware/mid")


router.post("/authors",authorController.authors)
router.post("/blogs",blogsController.blogs)
router.get("/blog",blogsController.getBlogs)
router.delete("/blogs/:blogId",blogsController.deleteblog)
router.delete("/blogs",blogsController.deleteQuery)
router.put("/blogs/:blogId",blogsController.updateBlog)
router.post("/createblog",authorController.authorLogin)
router.delete("/blog",blogsController.getBlogs)

module.exports = router;
