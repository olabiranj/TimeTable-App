var express = require('express');
var router = express.Router();
let passport = require("passport");

const timeTableController = require('../controllers/timeTableController');

function checkLoginStatus(req, res, next) {
    if (req.isAuthenticated()) {
        username = req.user.schEmail;
        return next();
    }

    req.flash('error', 'Login to continue');
    res.redirect('/#login');
}

router.get('/', timeTableController.homePage);
router.get('/student', timeTableController.studentsPage);
router.post('/student', timeTableController.studentsPost);
// router.get('/student2', timeTableController.studentsPage2);

router.post('/signup/user', passport.authenticate('local.registerUser', {
    successRedirect: '/registration',
    failureRedirect: '/#sign-up',
    failureFlash: true
}))
router.post('/login/user', passport.authenticate('local.loginUser', {
    successRedirect: '/dashboard',
    failureRedirect: '/#login',
    failureFlash: true
}))
router.get('/registration', timeTableController.reg);
router.get('/logout', timeTableController.logout);

router.use('/dashboard', checkLoginStatus);
router.get('/dashboard', timeTableController.dashboardPage);
router.get('/dashboard/classes', timeTableController.classPage);
router.post('/dashboard/classes', timeTableController.classPost);
router.get('/dashboard/classes/edit/:id', timeTableController.oneClassPage);
router.put('/dashboard/classes/edit/:id', timeTableController.oneClassPost);
router.delete('/dashboard/classes/edit/:id', checkLoginStatus, timeTableController.oneClassDelete);

router.get('/dashboard/subjects', timeTableController.subjectPage);
router.post('/dashboard/subjects', timeTableController.subjectPost);
router.get('/dashboard/subjects/edit/:id', timeTableController.oneSubjectPage);
router.put('/dashboard/subjects/edit/:id', timeTableController.oneSubjectPost);
router.delete('/dashboard/subjects/edit/:id', timeTableController.oneSubjectDelete);

router.get('/dashboard/timetable', timeTableController.timetable);
router.post('dashboard/createTimeTable', timeTableController.createTimeTable);


module.exports = router;
