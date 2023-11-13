// let { courses } = require("../data/data")
const { validationResult } = require("express-validator")

const Course = require("../models/model_course")
const HttpStuats = require("../stuats/HttpStuats")
const get_all = async (req, res) => {
    const query = req.query;

    const limit=query.limit || 10;
    const page=query.page || 1;    
    const skip = (page-1)*limit;
    // get data fron DB
    let courses = await Course.find({},{"__v":false}).limit(limit).skip(skip);
    res.json({ status: HttpStuats.SUCCESS, data: { courses: courses } })
}

const get_single = async (req, res) => {
    // const id = +req.params.id;
    // const course = courses.find((course) => course.id == id)
    try {
        const course = await Course.findById(req.params.id)
        if (!course) {
            return res.status(404).json({ status: HttpStuats.FAIL, data: { course } })
        }

        return res.json({ status: HttpStuats.SUCCESS, data: { course } })


    }
    catch (err) {
        return res.status(400).send({
            status: HttpStuats.ERROR,
            data: null,
            code: 400,
            message:err.message
        })
    }

}

const create = async (req, res) => {
    console.log(req.body)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: HttpStuats.FAIL, 
            data: errors.array()  })
    }
    // const course = { id: courses.length + 1, ...req.body }
    // courses.push(course);
    const newCourse = new Course(req.body);
    await newCourse.save()
    res.status(201).json({ status: HttpStuats.SUCCESS, 
        data: newCourse  })
}

const update = async (req, res) => {
    //     const id = +req.params.id;
    //     let course = courses.find((course) => course.id == id);
    //     if (!course) {
    //         return res.status(404).json({ msg: "no" })
    //     }
    //     course = { ...course, ...req.body }
    try {
        // بترجع الجديد ع طول
        const course = await Course.updateOne({ _id: req.params.id }, { $set: { ...req.body } })
        // بترجع القديم ع طول
        // const course=await Course.findByIdAndUpdate(req.params.id,{$set:{...req.body}})
        return res.status(200).json({ status: HttpStuats.SUCCESS, 
            data: course  })
    }
    catch (err) {
        return res.status(400).json({
            status: HttpStuats.ERROR,
            data: null,
            code: 400,
            message:err.message
        })
    }
}

const delete_one = async (req, res) => {
    // const id = +req.params.id;
    // courses = courses.filter((course) => course.id !== id)
    const course = await Course.deleteOne({ _id: req.params.id })

    res.status(200).json({ status: HttpStuats.SUCCESS, data: null })
}

module.exports = { get_all, get_single, create, update, delete_one };