let pluralize = require('pluralize');
let Class = require('../models/class.model.js');
let Subject = require('../models/subject.model.js');
let Timetable = require('../models/timetable.model.js');

let day = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
let period = ['t1', 't2', 't3', 't4', 't5', 't6', 't7', 't8'];

// create data model for timetable
async function createSlots(classname, tempArray) {
    let slots = [];
    let randArr = shuffleArray(tempArray);

    for (let i = 0; i < day.length; i++) {
        for (let j = 0; j < period.length; j++) {
            slots.push({ day: day[i], period: period[j], classname: classname, subject: randArr.shift(), isOccupied: true });
        }
    }
    return slots;
}

// convert param to array
function convertToArray(param) {
    if (Array.isArray(param)) {
        return param;
    } else {
        return param.split(' ');
    }
}

// shuffle array
function shuffleArray(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// async foreach
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

exports.homePage = function (req, res, next) {
    res.render('index', { title: 'TimeTable App', isLogin: req.isAuthenticated() });
};

exports.reg = function (req, res, next) {
    res.render('registration', { title: '' });
};

exports.logout = function (req, res, next) {
    req.logout();
    res.redirect('/');
};

exports.studentsPage = function (req, res, next) {
    Class.find({})
        .exec()
        .then((classes) => {
            res.render('student', { title: "Students Page", allclasses: classes});
        })
        .catch((err) => {
            console.log("Error occured", err);
        });
};

exports.studentsPost = function (req, res, next) {
    console.log(req.body.class);
    Timetable.find({'classname': req.body.class.toUpperCase()})
        .exec()
        .then((data) => {
            Class.find({})
                .exec()
                .catch((err) => {
                    console.log("Class fetch error occured", err);
                })
                .then((classes) => {
                    // res.json(data);
                    res.render('student', { title: "Students Page", allclasses: classes, data: data, day: day, dbData: true, classes: [{name: req.body.class}] });
                });
        })
        .catch((err) => {
            console.log("Timetable fetch error occured", err);
        });
};

exports.studentsPage2 = function (req, res, next) {
    res.render('student2');
};

exports.dashboardPage = function (req, res, next) {
    res.render('dashboard', { title: 'Admin Dashboard', username: req.user.adminName });
};

exports.classPage = function (req, res, next) {
    let bcrumb = { dashboard: '/dashboard', classes: '/dashboard/classes' };
    Class.find({})
        .exec()
        .then((classes) => {
            res.render('class', { title: "Manage Classes", classes: classes, bcrumb: bcrumb });
        })
        .catch((err) => {
            console.log("Error occured", err);
        });
}

exports.classPost = function (req, res, next) {

    let oneClass = new Class;
    oneClass.name = req.body.name;
    oneClass.status = req.body.status;

    oneClass.save()
        .then((data) => {
            res.redirect('/dashboard/classes');
        })
        .catch((err) => {
            console.log("Error occured", err);
            req.flash('error', `${err.name}: ${err._message}`)
            res.redirect('/dashboard/classes');
        });
}

exports.oneClassPage = function (req, res, next) {
    let bcrumb = { dashboard: '/dashboard', classes: '/dashboard/classes', edit: '' };
    let classID = req.params.id;
    Class.findOne({ _id: classID })
        .exec()
        .then((oneclass) => {
            res.render('classone', { title: "Edit Class: " + oneclass.name, oneclass: oneclass, bcrumb: bcrumb });
        })
        .catch((err) => {
            console.log("Error occured", err);
        });
}

exports.oneClassPost = function (req, res, next) {
    Class.findOneAndUpdate({ _id: req.body._id }, { name: req.body.name, status: req.body.status })
        .exec()
        .then(() => {
            res.redirect('/dashboard/classes');
        })
        .catch((err) => {
            console.log(err);
        })
}

exports.oneClassDelete = function (req, res, next) {
    Class.findByIdAndDelete({ _id: req.body._id })
        .exec()
        .then(() => {
            res.redirect('/dashboard/classes');
        })
        .catch((err) => {
            console.log(err);
        })
}

exports.subjectPage = function (req, res, next) {
    let bcrumb = { dashboard: '/dashboard', subjects: '/dashboard/subjects' };
    Class.find({ 'status': true })
        .exec()
        .then((classes) => {
            Subject.find({})
                .populate('class')
                .exec()
                .then((subjects) => {
                    res.render('subject', { title: "Manage Subjects", subjects: subjects, bcrumb: bcrumb, classes: classes, pluralize: pluralize });
                })
                .catch((err) => {
                    console.log("Subject query error:", err);
                });
        })
        .catch((err) => {
            console.log("Class query error:", err);
        });
}

exports.subjectPost = function (req, res, next) {
    let oneSubject = new Subject;
    oneSubject.name = req.body.name;
    oneSubject.status = req.body.status;

    let subjectPeriods = []
    cls = convertToArray(req.body.class);
    pds = convertToArray(req.body.periods);

    let pd = pds.filter(v => v != '-');
    pd.forEach((pl, index) => {
        subjectPeriods.push({ class_ref: cls[index], class_period: pl, class_name: cls[index] })
    })
    oneSubject.periods = subjectPeriods;

    oneSubject.save()
        .then((data) => {
            res.redirect('/dashboard/subjects');
        })
        .catch((err) => {
            console.log("Error occured", err);
            res.send(`${err.name}: ${err._message}`);
        });
}

exports.oneSubjectPage = function (req, res, next) {
    let bcrumb = { dashboard: '/dashboard', subjects: '/dashboard/subjects', edit: '' };
    Class.find({ 'status': true })
        .exec()
        .then((classes) => {
            Subject.findOne({ _id: req.params.id })
                .populate('class')
                .exec()
                .then((onesubject) => {
                    let unassigned = classes;
                    if (onesubject.class) {
                        unassigned = []
                        classes.forEach((c, index) => {
                            if (!onesubject.class.find((x) => x.name == c.name)) {
                                unassigned.push(classes[index]);
                            }
                        })
                    }

                    res.render('subjectone', { title: "Edit Subject: " + onesubject.name, onesubject: onesubject, classes: unassigned, bcrumb: bcrumb });
                })
                .catch((err) => {
                    console.log("Subject query error:", err);
                })
        })
        .catch((err) => {
            console.log("Class query error:", err);
        });
}

exports.oneSubjectPost = function (req, res, next) {
    Subject.findOneAndUpdate({ _id: req.body._id }, { name: req.body.name, status: req.body.status, class: req.body.class, periods: req.body.periods })
        .exec()
        .then(() => {
            res.redirect('/dashboard/subjects');
        })
        .catch((err) => {
            console.log(err);
        })
}

exports.oneSubjectDelete = function (req, res, next) {
    Subject.findByIdAndDelete({ _id: req.body._id })
        .exec()
        .then(() => {
            res.redirect('/dashboard/subjects');
        })
        .catch((err) => {
            console.log(err);
        })
}

exports.timetable = function (req, res, next) {
    // save to timetable db
    // a randomized array of the class subjects
    // each class exists X times in the array
    // X is the number of periods allocated to that subject

    // randomised array, subject ref
    let sbjArrayOutput = [], subjectRef = '';

    // call async function
    run().catch(error => { console.error(error.stack) });

    // find and iterate active classes async way
    async function run () {
        let classes =  await Class.find({ 'status': true })

        // async looping
        await asyncForEach(classes, async (clss) => {

            // get subjects assigned to each class
            let subjects = subjectRef = await Subject.find({'periods.class_ref': clss._id})

            // Checf if each class has timetable data
            let timetableData = await Timetable.countDocuments({'classname': clss.name.toUpperCase()});

            if (timetableData == 40) {

                // assign db data to data output
                let sbjArray = await Timetable.find({'classname': clss.name.toUpperCase()});
                sbjArrayOutput = sbjArrayOutput.concat(sbjArray);
            } else {

                // generate temp subject array
                let sbjTempArray = [];
                if (subjects.length > 0) {

                    // array of name of subjects only for padding randomised array
                    sbjtOnly = subjects.map(s => s.name );

                    // generate initial randomised array
                    subjects.forEach((sbjt) => {
                        sbjt.periods.forEach((sp) => {

                            // iterate each subject same times as the period set and push to randomised array
                            for (let c = 0; c < sp.class_period; c++) {
                                sbjTempArray.push(sbjt.name)
                            }
                        })
                    })

                    // pad randomised array if length less than 40
                    let sbjTempArrayLength = sbjTempArray.length;
                    for (let c = 0; c < (40 - sbjTempArrayLength); c++) {
                        sbjTempArray.push(shuffleArray(sbjtOnly)[0]);
                    }
                    // for (let c = 0; c < 40; c++) {
                    //     sbjTempArray.push('maths');
                    // }
                } else {
                    for (let c = 0; c < 40; c++) {
                        sbjTempArray.push('null');
                    }
                }

                // generate the proper timetable db objects to be saved
                let sbjArray = await createSlots(clss.name, sbjTempArray);
                sbjArrayOutput = sbjArrayOutput.concat(sbjArray);

                // save randomised array to timetable db
                await Timetable.deleteMany({'classname': clss.name.toUpperCase()})

                // save randomised array to db
                await Timetable.create(sbjArray)
            }

        })

        // output
        res.render('timetable', { title: "Manage Timetable", classes: classes, day: day, period: period, data: sbjArrayOutput, subjects: subjectRef});
    }

};

exports.createTimeTable = function (req, res, next) {
    let oneTimetable = new Timetable;
    oneTimetable.name = req.body.name;
    oneTimetable.time = req.body.time;
    oneTimetable.day = req.body.day;

    oneTimetable.save()
        .then((data) => {
            res.redirect('/timetable');
        })
        .catch((err) => {
            console.log("Error occured", err);
            res.send(`${err.name}: ${err._message}`);
        });
}
