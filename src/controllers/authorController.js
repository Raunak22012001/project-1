
const AuthorModel = require("../models/authorModel");


const createAuthor = async function (req, res) {
    try {
        const emailRegex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
        const nameRegex = /^[a-z]+$/i
        //    --------------------------------------------bodyvalidation----------------------------------------------------------------------------
        let author = req.body
        if (Object.keys(author).length == 0) {
            res.status(400).send({ msg: "Please Provide Data", error: "Body can't be Empty" })
        }
        // -------------------------------------------------fname validation----------------------------------------------------------------------
        if (!author.fname) {
            return res.status(400).send({ status: false, msg: "fname is required" })
        }
        if (!author.fname.match(nameRegex)) {
            return res.status(400).send({ status: false, msg: "Invalid format of fname" })
        }
        // --------------------------------------------------lname validation --------------------------------------------------------------------
        if (!author.lname) {
            return res.status(400).send({ status: false, msg: "lname is required" })
        }
        if (!author.lname.match(nameRegex)) {
            return res.status(400).send({ status: false, msg: "Invalid format of lname" })
        }
        // --------------------------------------------------title validation----------------------------------------------------------------------
<<<<<<< HEAD
        if(!author.title){
            return res.status(400).send({status:false,msg:"title must be present"})
=======
        if (!author.title) {
            return res.status(400).send({ status: false, msg: "title must be pragent" })
>>>>>>> cf0624d28c16f508626e7e695dea5dccb0499e5b
        }
        // -----------------------------------------------------email validation ------------------------------------------------------------
        if (!author.email) {
            res.status(400).send({ Status: false, msg: "email is required" })
        }
        if (author.email.match(emailRegex)) {
            return res.status(400).send({ status: false, msg: "  email must valid format" })
        }
        let alreadyexistemail = await AuthorModel.findOne({ email: author.email })
        if (alreadyexistemail) {
            return res.status(400).send({ status: false, msg: "email already exist" })
        }
        let authorCreated = await AuthorModel.create(author)
        res.status(201).send({ data: authorCreated })

    }

    catch (err) {
        res.status(500).send({ msg: "Server Error", error: err.message })

    }
};



module.exports.createAuthor = createAuthor;
