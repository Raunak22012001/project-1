const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel")

const blogcreate = async function (req, res) {
    try {
        let blog = req.body
        let authorid = blog.authorId
        // --------------------------------------body must be present validation---------------------------------------------------------------------
        if (Object.keys(blog).length == 0) {
            res.status(400).send({ msg: "Error", error: "Provide Proper Data" })
        }
        // --------------------------------------------authorid validation-----------------------------------------------------------------------------
        if (!authorid) {
            res.status(400).send({ msg: "Error", error: "Please Provide authroid" })
        }
        if (!blog.title) {
            return res.status(400).send({ status: false, msg: "title must be present" })
        }
        if (!blog.tags) {
            return res.status(400).send({ status: false, msg: "tags must be present" })
        }
        if (!blog.category) {
            return res.status(400).send({ status: false, msg: "category is required" })
        }

        let checkid = await authorModel.findById(authorid)
        if (!checkid) {
            res.status(404).send({ status: false, msg: "Author not found" })
        }

        let createblog = await blogModel.create(blog)
        res.status(201).send({ data: createblog })
    }

    catch (err) {
        res.status(500).send({ msg: "Server Error", error: err.message })
    }
};

//__________________________________Get Blog____________________________________


const getBlog = async function (req, res) {
    try {
        let data = req.query

        //If query is not given
        if (Object.keys(data) == 0) {
            let findBlogwithoutfilter = await blogModel.find({ $and: [{ isDeleted: false, isPublished: true }]})
            return res.status(200).send({ data: findBlogwithoutfilter})
        }
        //If query is given
        let findBlog = await blogModel.find({ $and: [{ isDeleted: false, isPublished: true }, data] })

        //Wrong data is given
        if(Object.keys(findBlog).length == 0) {
            return res.status(404).send({ msg: "blog not found" })
        }
        
        res.status(200).send({ msg: "Data Found", data: findBlog })
    }

    catch (err) {
        res.status(500).send({ msg: "Server Error", error: err.message })
    }
}

//-------------------------------------------------PUT Api-------------------------------------//


const updateBlog = async function (req, res) {
    try {
        const blogid = req.params.blogId
        const blogupdate = req.body
        
        // Blog Id is wrong
        const validId = await blogModel.findById(blogid)
        if(!validId){
            return res.status(404).send({msg : "No such a Blog"})
        // blog already deleted
        }if(validId){
            if(validId.isDeleted=== true){
                return res.status(404).send({msg:"blog does not exist"})
            }
        }
        // Body is Empty
        if (Object.keys(blogupdate).length == 0) {
            return res.status(400).send({ status: false, msg: "Data must be given" })
        }
      
        const updateBlog = await blogModel.findOneAndUpdate({ _id: blogid, isDeleted: false },
            {
                $set: { isPublished : true, body: blogupdate.body, title: blogupdate.title, publishedAt: new Date() },
                $push: { tags: blogupdate.tags, subcategory: blogupdate.subcategory }
            },
            { new: true });
        return res.status(201).send({ updateBlog })

    } catch (err) {
        res.status(500).send({ msg: "Server Error", error: err.message })
    }
}


/*____________________________________ Delete Blog By Id_________________________*/


const deleteblog = async function (req, res) {
    try {
        const blogid = req.params.blogId;
        const blog = await blogModel.findById(blogid)

        //Blog Id is wrong
        if(!blog){
            return res.status(404).send({status : false, error : "No such a Blog"})
        }

        // Blog is already deleted
        if (blog.isDeleted === true) {
            return res.status(404).send({ status: false, msg: "Blog not exist" })
        }

        let deletedb = await blogModel.findOneAndUpdate({ _id: blogid }, { isDeleted: true, deletedAt: new Date() })
        res.status(200).send({ status: true, msg: 'Data is deleted successfully' })
        } 
    
        catch (err) {
        res.status(500).send({ status: false, error: err })
    }

}

//____________________________________Delete by Query_____________________________________________

const deleteByQuery = async function(req,res){
    try{
        let data = req.query
        falseisdeleted = {isDeleted :false}
        let findBlog = await blogModel.findOne(data)
        if(Object.keys(data).length == 0){
            return res.status(404).send({msg : "qurey required"})
        }
        if(!findBlog){
            return res.status(404).send({msg:"data not found"})
            
        }
        let { category, authorId, tags, subcategory, isPublished } = data
        if (data.category) {
            falseisdeleted.category = category
        }
        if (data.authorId) {
            falseisdeleted.authorId = authorId
        }
        if (data.tags) {
            falseisdeleted.tags = tags
          
        }
        if (data.subcategory) {
            falseisdeleted.subcategory = subcategory
        }
        if (data.isPublished) {
            falseisdeleted.isPublished = isPublished
        }
        if (findBlog.isDeleted === true){
            return res.status(404).send({status:false,msg:"data not found"})
        }
        else{
            let deleteBlog = await blogModel.updateMany(data,
                {$set : {isDeleted : true , deletedAt : Date.now()}},
                {new : true})
            return res.status(200).send({msg : "Data is deleted", data : deleteBlog})
        }
    }

    catch(err){
        res.status(500).send({msg : "Server Error", error : err.message})

    }
            
}






//__________________________________Moduels____________________________________


module.exports.blogcreate = blogcreate;
module.exports.getBlog = getBlog;
module.exports.deleteblog = deleteblog;
module.exports.updateBlog = updateBlog;
module.exports.deleteByQuery = deleteByQuery