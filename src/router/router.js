const express = require('express');
const router = express.Router();
const authorController= require("../controllers/authorController")
const blogsController= require("../controllers/blogsController")


router.post("/authors",authorController.authors)
router.post("/blogs",blogsController.blogs)
router.get("/blog/:blogId",blogsController.getBlogs)



module.exports = router;