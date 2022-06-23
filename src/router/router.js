const express = require('express');
const router = express.Router();
const authorController= require("../controllers/authorController")
const blogsController= require("../controllers/blogsController")


router.post("/authors",authorController.authors)
router.post("/blogs",blogsController.blogs)
router.get("/blog/",blogsController.getBlogs)
router.delete("/blogs/:blogId", blogsController.deleteblog)
router.delete("/blogs", blogsController.deleteQuery)


module.exports = router;
