'use strict';
const express = require('express');
const { User, Course } = require('./models');

// Construct a router instance.
const router = express.Router();

// Handler function to wrap each route.
function asyncHandler(cb) {
    return async (req, res, next) => {
      try {
        await cb(req, res, next);
      } catch (error) {
        // Forward error to the global error handler
        next(error);
      }
    }
  }

// Route that returns a list of users.
router.get('/users', asyncHandler(async (req, res) => {
    const users = await User.findAll()
    res.json(users);
}));

// Route that creates a new user.
router.post('/users', asyncHandler(async (req, res) => {
    try {
        console.log("lets try")
        await User.create(req.body);
        console.log(req.body)
        res.status(201).json({ "message": "Account successfully created!" });
    } catch (error) {
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        const errors = error.errors.map(err => err.message);
        res.status(400).json({errors});   
        console.log("funktioniert nicht")
      } else {
        throw error;
      }
    }
}));

// Route that returns a list of courses.
router.get('/courses', asyncHandler(async (req, res) => {
    const courses = await Course.findAll()
    res.json(courses);
}));

// Route that returns a course based on its id.
router.get('/courses/:id', asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id)
    if(course) {
        res.json(course);
    } else{
        res.json("Course does not exist");
    }
}));

// Route that creates a new course.
router.post('/courses', asyncHandler(async (req, res) => {
    try {
        console.log("lets try")
        await Course.create(req.body);
        res.status(201).json({ "message": "Course successfully created!" });
    } catch (error) {
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        const errors = error.errors.map(err => err.message);
        res.status(400).json({errors});   
        console.log("Funktioniert nicht")
      } else {
        throw error;
      }
    }
}));

module.exports = router;