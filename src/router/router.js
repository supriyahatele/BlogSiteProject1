const express = require('express');
const router = express.Router();
const authorController= require("../controllers/authorController")
const blogsController= require("../controllers/blogsController")


router.post("/authors",authorController.authors)
router.post("/blogs",blogsController.blogs)
router.get("/blog/",blogsController.getBlogs)
router.delete("/blogs/:blogId", blogsController.deleteblog)



module.exports = router;

// const deleteUser = async function (req, res) {
// const blogId=req.params.blogId
    // let blog = await blogsModel.findById({blogId})
    // if(!blog)res.status(400).send("blog not found")
//     
//         let blogId = req.params.blogId;
//     let blogData = req.body
//     let blof
//     let deleteUser= await blogsModel.findOneAndDelete({_id: blogId,{ $set: { isDeleted: true } },blogData)};
//       res.status(200).send({data:deleteUser})
//     //Return an error if no user with the given id exists in the db
//     if (!deleteUser) {
//        res.status(404).send("No such user exists");
//     }
//   }
