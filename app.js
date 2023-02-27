
const express = require('express')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const Qs = require('query-string');
const dotenv = require("dotenv");
require('dotenv').config()

const app = express()
var ObjectId = require("mongodb").ObjectId
const DATABASE = process.env.DATABASE;
const APIKEY = process.env.APIKEY;
const { KEYUSER } = process.env;
const { KEYHOST } = process.env;
const date = require('date-and-time')
const sendgridtransport = require('nodemailer-sendgrid-transport')
const path = require("path")
const hbs = require("hbs")
const bcrypt = require('bcryptjs');
var bodyParser = require("body-parser")
app.use(bodyParser.urlencoded())
app.engine('html', require('ejs').renderFile);
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
} = require('./utils/users');
const formatMessage = require('./utils/messeges');
const formidable = require('formidable')
const { v4: uuidV4 } = require('uuid');
const url = require('url');
const fs = require('fs')
const pathset = path.join(__dirname, "/Templates/partials")
const setpath = path.join(__dirname, "/Templates/views")
hbs.registerPartials(pathset)

//--------------------mongodb-------------------------------------------------------------
var http = require("http").createServer(app)
var io = require("socket.io")(http, {
    cors: {
        origin: "https://neweducationworld.herokuapp.com",
        //origin: "http://localhost:8700",
        credentials: true
    }
})
var session = require("express-session");
const { start } = require('repl');
const { rawListeners } = require('process');
app.use(session({
    key: "admin",
    secret: "any random string",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}))

let a = []
let data = {};
let givenname;
let givenage;
console.log(setpath)
app.set("view engine", "hbs")
app.set("view engine", "ejs")
app.set("views", setpath)
app.get('/public', express.static('public'));
app.get('/myhome', function (req, res) {
})

app.get('/', function (req, res) {
    const value = date.format((new Date(Date.now())),
        'DD/MM/YYYY');
    console.log(value)
    MongoClient.connect( DATABASE, { useNewUrlParser: true }, function (error, client) {
        var blog = client.db("blog")
        blog.collection("studymaterial").find({ type: "Government Exams" }).toArray(function (error, materials) {
            let length1
            let length2
            let length3
            let length4
            let length5
            materials.forEach((elem) => {
                if (elem.content == "govexams") {
                    length1 += 1
                }
                else if (elem.content == "entranceexams") {
                    length2 += 1
                }
                else if (elem.content == "bankexams") {
                    length3 += 1
                }
                else if (elem.content == "managementexams") {
                    length4 += 1
                }
                else {
                    length5 += 1

                }
            })
            MongoClient.connect(DATABASE, { useNewUrlParser: true }, function (error, client) {
                var blog = client.db("blog")
                blog.collection("Quizzes").find({ "examname": "Government Exams" }).sort({ _id: 1 }).toArray(function (error, quizzes) {
                    res.render("index.ejs", {
                        materials: materials, quizdata: quizzes, stringdata: JSON.stringify(quizzes), username: req.session.username, data: req.session
                        , examname: "Government Exams", test: "Government Exams"
                    })
                })
            })
        })
    })

})

app.post('/login', (req, res) => {
    MongoClient.connect(DATABASE, { useNewUrlParser: true }, function (error, client) {
        var blog = client.db("blog")
        blog.collection("users").findOne({
            $and: [
                {
                    "username": req.body.username,

                },
                {
                    "password": req.body.password,
                }
            ]
        }, function (error, data) {
            if (data) {
                if (data.Admin) {
                    payload = {
                        email: data.email,
                        username: data.username,
                        isadmin: data.Admin
                    }
                    const token = jwt.sign(payload, process.env.KEY_NEW, { expiresIn: '1hr' });
                    var mailOptions = {
                        from: "rav39439@gmail.com",
                        to: data.email,
                        subject: "signin successful",
                        html: `<h2>${data.username}! Thanks for registering on our site</h2>
                    <h4>Please verify your mail to continue</h4>
                    <a href="http://localhost:8700/verify-email?token=${token}">verify your email</a>
                    `
                    }
                    transporter.sendMail(mailOptions, function (error, info) {

                        if (error) {
                            console.log(error)
                        } else {
                            res.render("verify-email.ejs", { token: token })
                            console.log("verificartion email is sent")
                        }
                    })
                }
                else {
                    req.session.username = data.username
                    req.session.email = data.email
                    req.session.isadmin = data.isadmin
                    res.redirect('/')
                }
            }
            else {
                res.send("Wrong username or password")
            }
        })

    })
})

app.get('/login', (req, res) => {
    res.render("userinformation.ejs", { data: req.session })
})

app.get('/createtable', (req, res) => {
    res.render("createquiz.ejs")
})

app.get("/viewquestions", function (req, res) {

    res.render("viewquestions.hbs")
})

app.get('/postquestions', (req, res) => {
    res.render("postquestions.hbs")
})

var transporter = nodemailer.createTransport(sendgridtransport({
    auth: {
        api_key: APIKEY,
    },
}))

app.get('/register', (req, res) => {
    res.render("register.ejs", { username: req.session.username, data: req.session })
})

app.get("/fileupload", (req, res) => {
    res.render("upload.hbs")
})

app.get("/multilevelquiz", (req, res) => {
    res.render("multiplelevel.hbs")
})
app.get("/readinfo1", (req, res) => {
    res.render("readinfo1.hbs", { Myname: req.query.Myname1, Myreg: req.query.regno1, table2: req.query.Myquiz })
})

app.get("/findresult", (req, res) => {
    res.render("findmyresult.hbs")
})

app.get("/createsolutions", (req, res) => {
    res.render("createsolutions.hbs")
})

app.get("/enterquizname", function (req, res) {
    res.render("enterquizname.ejs", { username: req.session.username })
})

app.get("/logout", function (req, res) {
    req.session.destroy()
    res.redirect('/')
})

//----------------------------------------newquizactions--------------------------------------
var MongoClient = require("mongodb").MongoClient;
MongoClient.connect(DATABASE, { useNewUrlParser: true }, function (error, client) {
    var blog = client.db("blog")
    console.log("DB connected")
})

app.post("/newquiz4", (req, res) => {
    function findRanks(arr) {
        const { length } = arr;
        let sortArray = arr.slice();
        sortArray.sort((a, b) => b - a);
        const result = [];
        for (let i = 0; i < length; i++) {
            const j = sortArray.indexOf(arr[i])
            result.push(j + 1);
        }
        return result;
    }
    MongoClient.connect(DATABASE, { useNewUrlParser: true }, function (error, client) {
        var blog = client.db("blog")
        blog.collection("Quizzes").findOne({ "quizname": req.body.Mytable2 }, function (error, quiz) {
            let user = quiz?.quizattempters.find(data => data.name == req.body.Myname2)
            // if(req.session.username){
            console.log(quiz?.quizattempters)
            let allmarks = []
            let studentranks = []
            quiz.quizattempters.forEach((elem) => {
                allmarks.push(elem.marks)
            })
            studentranks = findRanks(allmarks)
            let studentposition = quiz.quizattempters.findIndex(data => data?.marks == user?.marks)
            let remaining = quiz.quizattempters.length - studentranks[studentposition] + 1
            let percentitle = (remaining / quiz.quizattempters.length) * 100
            if (user) {
                res.send(`<h1>You have already attempted this exam</h1><br> <h1>Your Score ${user.marks}</h1>
    <br> <h1> <a href="/viewsolutions?name=${user.name}&quizname=${req.body.Mytable2}&rank=${studentranks[studentposition]}&percentile=${percentitle}&quiz=${quiz}&responses=${user.responses}">View Solutions</a></h1>
    `)
            } else {
                res.render("newquiz4.hbs", { userd: JSON.stringify(quiz?.quizquestions), name2: req.body.Myname2, reg: req.body.registration, table2: req.body.Mytable2 })
            }
        })
    })

    app.get("/viewsolutions", function (req, res) {
        let name = req.query.name
        let quizname = req.query.quizname
        let rank = req.query.rank
        let percentile = req.query.percentile
        MongoClient.connect(DATABASE, { useNewUrlParser: true }, function (error, client) {
            var blog = client.db("blog")
            blog.collection("Quizzes").findOne({ "quizname": quizname }, function (error, quiz) {
                let user = quiz?.quizattempters.find(data => data.name == name)
                res.render("resultfile.ejs", { name: name, rank: rank, percentile: percentile, usedata: JSON.stringify(quiz.quizquestions), responses: JSON.stringify(user), quizname: quizname })
            })
        })
    })
})

app.get('/Mysecrets', (req, res) => {
    MongoClient.connect(DATABASE, { useNewUrlParser: true }, function (error, client) {
        var blog = client.db("blog")
        blog.collection("Quizzes").find().sort({ _id: 1 }).toArray(function (error, quizzes) {
            res.render("listoftests.ejs", { quizdata: quizzes, stringdata: JSON.stringify(quizzes), username: req.session.username, data: req.session, examname: "Government Exams", test: "All Quizzes" })
        })
    })
})


app.get('/secrets', (req, res) => {
    MongoClient.connect(DATABASE, { useNewUrlParser: true }, function (error, client) {
        var blog = client.db("blog")
        blog.collection("Quizzes").find().sort({ _id: 1 }).toArray(function (error, quizzes) {
            console.log(quizzes)
            res.render("tests.ejs", { quizdata: quizzes, username: req.session.username, test: "All Quizzes" })
        })
    })
})


app.get('/filterexam', (req, res) => {
    MongoClient.connect(DATABASE, { useNewUrlParser: true }, function (error, client) {
        var blog = client.db("blog")
        blog.collection("Quizzes").find({ "examname": req.query.exam }).sort({ _id: 1 }).toArray(function (error, quizzes) {
            res.render("listoftests.ejs", { quizdata: quizzes, stringdata: JSON.stringify(quizzes), username: req.session.username, data: req.session, examname: req.query.exam, test: req.query.exam })
        })
    })
})

app.get('/ExamFilter', (req, res) => {
    if (req.query.test == null && req.query.exam != null) {
        MongoClient.connect(DATABASE, { useNewUrlParser: true }, function (error, client) {
            var blog = client.db("blog")
            blog.collection("studymaterial").find({ "type": req.query.exam }).sort({ _id: 1 }).toArray(function (error, materials) {
                res.render("index.ejs", {
                    materials: materials, username: req.session.username, data: req.session
                    , examname: req.query.exam, test: req.query.exam
                })
            })
        })
    }
    else {
        let image = ""
        MongoClient.connect(DATABASE, { useNewUrlParser: true }, function (error, client) {
            var blog = client.db("blog")
            blog.collection("studymaterial").find({
                $and: [
                    { 'type': req.query.exam },
                    { 'content': req.query.test }
                ]
            }
            ).sort({ _id: 1 }).toArray(function (error, materials) {
                res.render("index.ejs", {
                    materials: materials, username: req.session.username, data: req.session
                    , examname: req.query.exam, test: req.query.test
                })
            })
        })
    }
})


app.get('/ExamFilter1', (req, res) => {
    if (req.query.test == null && req.query.exam != null) {
        MongoClient.connect(DATABASE, { useNewUrlParser: true }, function (error, client) {
            var blog = client.db("blog")
            blog.collection("Quizzes").find({ "examname": req.query.exam }).sort({ _id: 1 }).toArray(function (error, quizzes) {
                res.render("listoftests.ejs", {
                    quizdata: quizzes, stringdata: JSON.stringify(quizzes), username: req.session.username, data: req.session
                    , examname: req.query.exam, test: req.query.exam
                })
            })
        })
    }
    else {
        MongoClient.connect(DATABASE, { useNewUrlParser: true }, function (error, client) {
            var blog = client.db("blog")
            blog.collection("Quizzes").find({
                $and: [
                    { 'examname': req.query.exam },
                    { 'exam': req.query.test }
                ]
            }
            ).sort({ _id: 1 }).toArray(function (error, quizzes) {
                res.render("listoftests.ejs", {
                    quizdata: quizzes, stringdata: JSON.stringify(quizzes), username: req.session.username, data: req.session
                    , examname: req.query.exam, test: req.query.test
                })
            })
        })
    }
})

app.get('/ExamFilter2', (req, res) => {
    if (req.query.sub == null && req.query.test != null) {
        MongoClient.connect(DATABASE, { useNewUrlParser: true }, function (error, client) {
            var blog = client.db("blog")
            blog.collection("Quizzes").find({ "examname": req.query.test }).sort({ _id: 1 }).toArray(function (error, quizzes) {
                res.render("listoftests.ejs", {
                    quizdata: quizzes, stringdata: JSON.stringify(quizzes), username: req.session.username, data: req.session
                    , examname: req.query.exam, test: req.query.exam
                })
            })
        })
    }
    else {
        MongoClient.connect(DATABASE, { useNewUrlParser: true }, function (error, client) {
            var blog = client.db("blog")
            blog.collection("Quizzes").find({
                $and: [
                    { 'subcategory': req.query.sub },
                    { 'exam': req.query.test }
                ]
            }
            ).sort({ _id: 1 }).toArray(function (error, quizzes) {
                res.render("listoftests.ejs", {
                    quizdata: quizzes, stringdata: JSON.stringify(quizzes), username: req.session.username, data: req.session
                    , examname: req.query.exam, test: req.query.test, sub: req.query.sub
                })
            })
        })
    }
})

app.get('/ExamFilter3', (req, res) => {
    if (req.query.sub == null && req.query.test != null) {
        MongoClient.connect(DATABASE, { useNewUrlParser: true }, function (error, client) {
            var blog = client.db("blog")
            blog.collection("studymaterial").find({ "examname": req.query.test }).sort({ _id: 1 }).toArray(function (error, quizzes) {
                res.render("index.ejs", {
                    materials: quizzes, stringdata: JSON.stringify(quizzes), username: req.session.username, data: req.session
                    , examname: req.query.exam, test: req.query.exam
                })
            })
        })
    }
    else {
        MongoClient.connect(DATABASE, { useNewUrlParser: true }, function (error, client) {
            var blog = client.db("blog")
            blog.collection("studymaterial").find({
                $and: [
                    { 'subcategory': req.query.sub },
                    { 'content': req.query.test }
                ]
            }
            ).sort({ _id: 1 }).toArray(function (error, quizzes) {
                res.render("index.ejs", {
                    materials: quizzes, stringdata: JSON.stringify(quizzes), username: req.session.username, data: req.session
                    , examname: req.query.exam, test: req.query.test, sub: req.query.sub
                })
            })
        })
    }
})


app.post("/getallcontent", function (req, res) {
    MongoClient.connect(DATABASE, { useNewUrlParser: true }, function (error, client) {
        var blog = client.db("blog")
        blog.collection("studymaterial").find().toArray(function (error, materials) {
            let length1
            let length2
            let length3
            let length4
            let length5
            materials.forEach((elem) => {
                if (elem.content == "govexams") {
                    length1 += 1
                }
                else if (elem.content == "entranceexams") {
                    length2 += 1
                }
                else if (elem.content == "bankexams") {
                    length3 += 1
                }
                else if (elem.content == "managementexams") {
                    length4 += 1
                }
                else {
                    length5 += 1
                }
            })
            res.render("getallcontent.ejs", {
                materials: materials, length1: length1, length2: length2, length3: length3
                , length4: length4, length5: length5
            })
        })
    })
})


app.get("/studyinfo", function (req, res) {
    MongoClient.connect(DATABASE, { useNewUrlParser: true }, function (error, client) {
        var blog = client.db("blog")
        blog.collection("studymaterial").find({
            "content": req.query.data
        }).toArray(function (error, content) {
            console.log(content)
            res.render("allstudymaterials.ejs", { data: content })
        })
    })

})

app.post("/uploadcontent", function (req, res) {
    MongoClient.connect(DATABASE, { useNewUrlParser: true }, function (error, client) {
        var blog = client.db("blog")
        blog.collection("studymaterial").insertOne({
            "topic": req.body.details,
            "content": req.body.examname,
            "type": req.body.examtype,
            "data": req.body.uploadPreview,
            "filedata": req.body.myfile,
            "status": req.body.status,
            "details": req.body.details,
            "previewimg": req.body.previewimg,
            "MaterialType": req.body.MaterialType,
            "currentDate": req.body.currentDate,
            "subcategory": req.body.sub
        }, function (err, data) {
            res.json({
                "message": "success",
            })
        })
    })
})


var arrayRankTransform = arr => {
    const sorted = [...arr].sort((a, b) => b.marks - a.marks)
    return arr.map((x) => sorted.indexOf(x) + 1)
}

app.post("/newresultmulti", (req, res) => {
    if (req.body.examname == "Highlevelexam") {
        MongoClient.connect(DATABASE, { useNewUrlParser: true }, function (error, client) {
            var blog = client.db("blog")
            blog.collection("Quizzes").findOne({ "quizname": req.body.myquiz }, function (error, quiz) {
                let userresponses = quiz.quizattempters.find(elem => elem.name == req.body.name)
                let allmarks = []
                let studentranks = []
                quiz.quizattempters.forEach((elem) => {
                    allmarks.push(elem.marks)
                })
                const findRanks = (arr = []) => {
                    const { length } = arr;
                    let sortArray = arr.slice();
                    sortArray.sort((a, b) => b - a);
                    const result = [];
                    for (let i = 0; i < length; i++) {
                        const j = sortArray.indexOf(arr[i])
                        result.push(j + 1);
                    }
                    return result;
                };
                studentranks = findRanks(allmarks)
                let studentposition = quiz.quizattempters.findIndex(data => data.marks == userresponses.marks)
                let remaining = quiz.quizattempters.length - studentranks[studentposition] + 1
                let percentitle = (remaining / quiz.quizattempters.length) * 100
                if (userresponses) {
                    res.render("resultfile.ejs", {
                        usedata: JSON.stringify(quiz.quizquestions), name: req.body.name, mydata: quiz.quizattempters, responses: JSON.stringify(userresponses), quizname: req.body.myquiz, ranks: studentranks, rank: studentranks[studentposition]
                        , percentile: percentitle
                    })
                }
                else {
                    res.send("No such user has attempted the Exam")
                }
            })
        })
    }

})


app.post("/postmultioptions", (req, res) => {
    var answersobj = {
        "answer1": req.body.answercode1,
        "answer2": req.body.answercode2,
        "answer3": req.body.answercode3,
    }
    var newanswerobj = JSON.stringify(answersobj)
    MongoClient.connect(DATABASE, { useNewUrlParser: true }, function (error, client) {
        var blog = client.db("blog")
        blog.collection("Quizzes").updateOne({
            "quizname": req.body.yourquiz
        }, {
            $push: {
                "quizquestions": {
                    numb: req.body.qno,
                    question: req.body.myquestion,
                    queimg: req.body.myquestionimg,
                    type: req.body.type,
                    answercode: newanswerobj,
                    option1: req.body.myquestion1,
                    option2: req.body.myquestion2,
                    option3: req.body.myquestion3,
                    option4: req.body.myquestion4,
                    solution: req.body.Mysolutions,
                    solutionsimg: req.body.Mysolutionsimg,
                    myfile: req.body.myfiles,
                    time: req.body.mytime,
                    qsection: req.body.qsection,
                    optionImg1: req.body.optionImg1,
                    optionImg2: req.body.optionImg2,
                    optionImg3: req.body.optionImg3,
                    optionImg4: req.body.optionImg4,
                    section: req.body.section,
                    integerans: req.body.myinteger,
                    passage: req.body.passage,
                    passageimg: req.body.passageimg,
                    postivemarks: req.body.pm,
                    negativemarks: req.body.nm
                }
            }
        }, function (err, data) {
            res.json({
                "text": "successfully posted",
            })
        });
    });
})

function GetallQuestions(req, res, next) {
    MongoClient.connect(DATABASE, { useNewUrlParser: true }, function (error, client) {
        var blog = client.db("blog")
        blog.collection("Quizzes").findOne({ "quizname": req.body.quizname }, function (error, quiz) {
            if (quiz) {
                req.quizquestions = quiz.quizquestions
                req.quizname = req.body.quizname
                next()
            }
            else {
                console.log(error)
            }
        })
    })
}

app.post("/testt", GetallQuestions, function (req, res) {
    let index = req.body.index
    var key1 = "quizname";
    var key2 = "index"
    delete req.body[key1];
    delete req.body[key2];
    console.log(index)
    req.quizquestions[parseInt(index)] = req.body
    MongoClient.connect(DATABASE, { useNewUrlParser: true }, function (error, client) {
        var blog = client.db("blog")
        blog.collection("Quizzes").updateOne({
            "quizname": req.quizname
        }, {
            $set: {
                "quizquestions": req.quizquestions
            }
        }, function (err, data) {
            res.json({
                "message": "successfully updated"
            })

        })
    })
})

app.post("/deletequestion", GetallQuestions, function (req, res) {
    let filtered = []
    for (let i = 0; i < req.quizquestions.length; i++) {
        if (i != parseInt(req.body.index)) {
            filtered.push(req.quizquestions[i])
        }
    }
    MongoClient.connect(DATABASE, { useNewUrlParser: true }, function (error, client) {
        var blog = client.db("blog")
        blog.collection("Quizzes").updateOne({
            "quizname": req.quizname
        }, {
            $set: {
                "quizquestions": filtered
            }
        }, function (err, data) {
            res.json({
                "message": "successfully updated"
            })
        })
    })

})

app.post("/newquiz4result", function (req, res) {
    let g = []
    let b = []
    b.push(1)
    let a = JSON.parse(req.body.responses)
    for (let i = 0; i < a.length; i++) {
        if (Array.isArray(a[i])) {
            var json_arr = {};
            let t = a[i]
            if (t[0]) {
                json_arr["answer1"] = t[0];
            }
            if (t[1]) {
                json_arr["answer2"] = t[1];
            }
            if (t[2]) {
                json_arr["answer3"] = t[2]
            }
            let json = json_arr;
            b[i] = json
        }
        else {
            b[i] = a[i]
        }
        g.push(b[i])
    }
    MongoClient.connect(DATABASE, { useNewUrlParser: true }, function (error, client) {
        var blog = client.db("blog")

        blog.collection("Quizzes").updateOne({
            "quizname": req.body.quizname
        }, {
            $push: {
                "quizattempters": {
                    name: req.body.studentname,
                    answers: g,
                    marks: req.body.marks,
                    rank: ""
                }
            }
        }, function (err, data) {
            res.json({
                "text": "successfully posted",
            })
        });

    });
})

app.get("/createnewtable", function (req, res) {
    res.render("createnewtable.ejs")
})

function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);
    var hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hours ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay + sDisplay;
}

app.post("/createnewtable", function (req, res) {
    var time = secondsToHms(req.body.time)
    MongoClient.connect(DATABASE, { useNewUrlParser: true }, function (error, client) {
        var blog = client.db("blog")
        blog.collection("Quizzes").insertOne
            ({
                "quizname": req.body.quizname,
                "exam": req.body.examname,
                "examname": req.body.examtype,
                "noofquestions": req.body.noofquestions,
                "status": req.body.status,
                "desc": req.body.desc,
                "quizquestions": [],
                "quizattempters": [],
                "nsection": req.body.nsection,
                "marks": req.body.marks,
                "quizinfo": req.body.quizinfo,
                "quizdesc": req.body.quizdesc,
                "time": time,
                "resultstatus": req.body.resultstatus,
                "subcategory": req.body.subcategory
            },
                function (error, document) {
                })

    })
    res.render("postmultioptions.ejs")
})

app.get("/postmultioptions", function (req, res) {
    res.render("postmultioptions.ejs")
})

app.post("/Mysecrets", function (req, res) {
    if (req.body.code == process.env.KEY_CODE) {
        res.render("createquiz.ejs")
    }
})

app.get("/deletequiz", function (req, res) {
    res.render("deletequiz.hbs")
})

app.post("/deletequiz", function (req, res) {
    MongoClient.connect(DATABASE, { useNewUrlParser: true }, function (error, client) {
        var blog = client.db("blog")
        blog.collection("Quizzes").deleteOne(
            { quizname: req.body.quizname }, function (error, data) {
                res.json({
                    message: "quiz deleted"
                })
            })
    })
})

app.get("/EditstudyMaterial", function (req, res) {
    MongoClient.connect(DATABASE, { useNewUrlParser: true }, function (error, client) {
        var blog = client.db("blog")
        blog.collection("studymaterial").find().sort({ _id: 1 }).toArray(function (error, materials) {
            res.render("editstudymaterial.ejs", {
                materials: materials, username: req.session.username, data: req.session
                , examname: req.query.exam, test: req.query.exam
            })
        })
    })
})

app.post("/EditstudyMaterial", function (req, res) {
    MongoClient.connect(DATABASE, { useNewUrlParser: true }, function (error, client) {
        var blog = client.db("blog")
        blog.collection("studymaterial").updateOne({
            "_id": ObjectId(req.body.id)
        }, {
            $set: {
                "filedata": req.body.filedata,
                "topic": req.body.topic,
                "details": req.body.details
            }
        }, function (err, data) {
            res.json({
                "message": "Material is successfully updated"
            })
        })
    })

})


app.post("/deleteMaterial", function (req, res) {
    console.log(req.body.id)
    MongoClient.connect(DATABASE, { useNewUrlParser: true }, function (error, client) {
        var blog = client.db("blog")
        blog.collection("studymaterial").deleteOne({
            "_id": ObjectId(req.body.id)
        }, function (err, data) {
            res.json({
                "message": "Material is successfully deleted"
            })
        })
    })

})

app.get("/getquizresult", function (req, res) {
    MongoClient.connect(DATABASE, { useNewUrlParser: true }, function (error, client) {
        var blog = client.db("blog")
        blog.collection("Quizzes").find().sort({ _id: 1 }).toArray(function (error, quizzes) {
            res.render("getquizresult.ejs", { quizdata: quizzes })
        })
    })
})


app.post("/getquizresult", function (req, res) {
    MongoClient.connect(DATABASE, { useNewUrlParser: true }, function (error, client) {
        var blog = client.db("blog")
        blog.collection("Quizzes").findOne({ "quizname": req.body.quizname }, function (error, quiz) {
            console.log(quiz)
            res.render("newresultfile.ejs", { Mydata: JSON.stringify(quiz?.quizquestions), quizname: req.body.quizname })

        })
    })
})

app.get("/updatequiz", function (req, res) {
    MongoClient.connect(DATABASE, { useNewUrlParser: true }, function (error, client) {
        var blog = client.db("blog")
        blog.collection("Quizzes").find().sort().toArray(function (error, quizzes) {
            res.render("updatelist.ejs", { quizdata: quizzes, username: req.session.username, data: req.session })

        })
    })
})

app.post("/updatequiz", function (req, res) {
    MongoClient.connect(DATABASE, { useNewUrlParser: true }, function (error, client) {
        var blog = client.db("blog")
        blog.collection("Quizzes").updateOne({
            "quizname": req.body.myquiz
        }, {
            $set: {
                "status": req.body.status,
                "resultstatus": req.body.resultstatus
            }
        }, function (err, data) {
            res.json({
                "message": "quiz status is updated"
            })
        })
    })

})



app.get("/enterquiz", function (req, res) {
    res.render("readinfo3.hbs", { Myname: req.session.username, Myreg: req.session.uniquecode })
})

app.get("/enterquiz4", function (req, res) {
    res.render("readinfo2.hbs", { Myname: req.session.username, Myreg: req.session.uniquecode })
})


app.get("/enterquiz1", function (req, res) {
    MongoClient.connect(DATABASE, { useNewUrlParser: true }, function (error, client) {
        var blog = client.db("blog")
        blog.collection("Quizzes").findOne({ "quizname": req.query.myquiz }, function (error, quiz) {
            let data = quiz
            let section1length = 0;
            let section2length = 0;
            let section3length = 0
            let section4length = 0
            let time = data.time
            let noofquizattemts = data.quizattempters.length
            if (parseInt(data.nsection) == 4) {
                section1length = data.quizquestions[0]?.qsection
                section2length = data.quizquestions[section1length]?.qsection
                section3length = data.quizquestions[parseInt(section2length) + parseInt(section1length)]?.qsection
                section4length = data.quizquestions[parseInt(section2length) + parseInt(section1length) + parseInt(section3length)]?.qsection
            }
            else if (parseInt(data.nsection) == 3) {
                section1length = data.quizquestions[0]?.qsection
                section2length = data.quizquestions[section1length]?.qsection

                section3length = data.quizquestions[parseInt(section2length) + parseInt(section1length)]?.qsection
            }
            else if (parseInt(data.nsection) == 2) {
                section1length = data.quizquestions[0]?.qsection
                section2length = data.quizquestions[section1length]?.qsection
            }
            else {
                section1length = data.quizquestions[0]?.qsection
            }
            res.render("readinfo3.ejs", {
                table2: req.query.myquiz, quiz: quiz,
                Myname: req.session.username,
                Myreg: req.session.uniquecode,
                section1length: section1length,
                section2length: section2length
                , section3length: section3length, section4length: section4length, time: time, quizattempts: noofquizattemts
            })
        })
    })
})


app.get("/getresult", function (req, res) {
    MongoClient.connect(DATABASE, { useNewUrlParser: true }, function (error, client) {
        var blog = client.db("blog")
        blog.collection("Quizzes").find().sort({ _id: 1 }).toArray(function (error, quizzes) {
            res.render("getresult.ejs", { quizdata: quizzes, username: req.session.username })
        })
    })

})

app.get("/Editquestions", function (req, res) {
    MongoClient.connect(DATABASE, { useNewUrlParser: true }, function (error, client) {
        var blog = client.db("blog")
        blog.collection("Quizzes").find().sort({ _id: 1 }).toArray(function (error, quizzes) {
            res.render("Editquestions.ejs", { quizdata: quizzes, stringdata: JSON.stringify(quizzes), username: req.session.username, data: req.session })
        })
    })

})

app.post("/getquizquestions", function (req, res) {
    MongoClient.connect(DATABASE, { useNewUrlParser: true }, function (error, client) {
        var blog = client.db("blog")
        blog.collection("Quizzes").findOne({ "quizname": req.body.quizname }, function (error, quiz) {
            var questions = JSON.stringify(quiz?.quizquestions)
            res.render("Editpage.ejs", { quiz: quiz, stringquestions: req.body.quizname })

        })
    })
})


app.get("/Editquiz", function (req, res) {
    MongoClient.connect(DATABASE, { useNewUrlParser: true }, function (error, client) {
        var blog = client.db("blog")
        blog.collection("Quizzes").find().sort({ _id: 1 }).toArray(function (error, quizzes) {
            res.render("QuizStatus.ejs", { quizdata: quizzes, stringdata: JSON.stringify(quizzes), username: req.session.username, data: req.session })
        })
    })
})


app.post("/Editquiz", function (req, res) {
    MongoClient.connect(DATABASE, { useNewUrlParser: true }, function (error, client) {
        var blog = client.db("blog")
        blog.collection("Quizzes").updateOne({
            "quizname": req.body.oldquizname
        }, {
            $set: {
                "quizname": req.body.quizname,
                "exam": req.body.exam,
                "examname": req.body.examname,
                "noofquestions": req.body.noofquestions,
                "desc": req.body.desc,
                "nsection": req.body.nsection,
                "marks": req.body.marks,
                "quizinfo": req.body.quizinfo,
                "quizdesc": req.body.quizdesc,
                "quizdesc": req.body.quizdesc,
                "time": req.body.time,

            }
        }, function (err, data) {
            res.json({
                "message": "quiz is successfully updated"
            })
        })
    })

})

app.get("/uploadcontent", function (req, res) {
    res.render("uploadcontent.ejs")
})

app.post("/do-uploadprofileimage", function (req, res) {
    var formData = new formidable.IncomingForm();
    formData.parse(req, function (error, fields, files) {
        var oldPath = files.file.path;
        var newPath = "public/newimages/" + files.file.name;
        fs.copyFile(oldPath, newPath, function (err) {
            res.send("/" + newPath)
        })
    })
})


app.post("/do-uploadprofileimage1", function (req, res) {
    console.log("upload image is runing")
    var formData = new formidable.IncomingForm();
    formData.parse(req, function (error, fields, files) {
        var oldPath = files.file.path;
        var newPath = "public/newimages/" + files.file.name;
        console.log(newPath)
        fs.copyFile(oldPath, newPath, function (err) {
            res.send("/" + newPath)
        })
    })
})


app.post("/do-uploadprofileimage2", function (req, res) {
    console.log("upload image is runing")
    var formData = new formidable.IncomingForm();
    formData.parse(req, function (error, fields, files) {
        var oldPath = files.file.path;
        var newPath = "public/newimages/" + files.file.name;
        console.log(newPath)
        fs.copyFile(oldPath, newPath, function (err) {
            res.send("/" + newPath)
        })
    })
})


app.post("/do-uploadprofileimage3", function (req, res) {
    res.send(req.body.uploadimg)
})


app.post("/do-uploadprofileimage4", function (req, res) {
    console.log("upload image is runing")
    var formData = new formidable.IncomingForm();
    formData.parse(req, function (error, fields, files) {
        var oldPath = files.file.path;
        var newPath = "public/answerimages/" + files.file.name;
        console.log(newPath)
        fs.copyFile(oldPath, newPath, function (err) {
            res.send("/" + newPath)
        })
    })
})

app.post("/do-uploadprofileimage5", function (req, res) {
    console.log("upload image is runing")
    var formData = new formidable.IncomingForm();
    formData.parse(req, function (error, fields, files) {
        var oldPath = files.file.path;
        var newPath = "public/uploadedimages/" + files.file.name;
        console.log(newPath)
        fs.copyFile(oldPath, newPath, function (err) {
            res.send(files.file.name)
        })
    })
})

app.post("/do-uploadpdffile", function (req, res) {
    console.log("upload image is runing")
    var formData = new formidable.IncomingForm();
    formData.parse(req, function (error, fields, files) {
        var oldPath = files.file.path;
        var newPath = "public/files/" + files.file.name;
        console.log(newPath)
        fs.copyFile(oldPath, newPath, function (err) {
            res.send(files.file.name)
        })
    })
})


app.post("/do-uploadprofileimage6", function (req, res) {
    console.log("upload image is runing")
    var formData = new formidable.IncomingForm();
    formData.parse(req, function (error, fields, files) {
        var oldPath = files.file.path;
        var newPath = "public/askedquestion/" + files.file.name;
        console.log(newPath)
        fs.copyFile(oldPath, newPath, function (err) {
            res.send("/" + newPath)
        })
    })
})


app.get("/getallcontent", function (req, res) {
    res.render("getallcontent.ejs", { username: req.session.username })
})


app.get("/Getallcontents", function (req, res) {
    res.render("Getmycontents.ejs", { username: req.session.username })
})



app.get("/test", function (req, res) {
    res.render("test.ejs")
})

app.get("/introfile", function (req, res) {
    console.log("introfile is running")
    var file = req.query.file;
    var filestream = fs.createReadStream(`./public/files/${file}`);
    res.writeHead(200, {
        "Content-Type": "application/pdf", "Content-Transfer-Encoding": "binary"
    });
    filestream.on('data', function (chunk) {
        res.write(chunk);
    });
    filestream.on('end', function () {
        res.end();
    });

})

app.get("/images/:filename", function (req, res) {
    console.log("introfile is running")
    var file = req.params.filename;
    var filestream = fs.createReadStream(`./public/uploadedimages/${file}`);
    res.writeHead(200, {
    });

    filestream.on('data', function (chunk) {
        res.write(chunk);
    });
    filestream.on('end', function () {
        res.end();
    });

})


app.get("/wholeimage", function (req, res) {
    image = "/public/uploadedimages/" + req.query.image
    console.log(req.query.image)
    res.render("newimage.ejs", { myimage: req.query.image })
})

app.get("/customimage", function (req, res) {
    image = "/public/uploadedimages/" + req.query.image
    res.render("newimage1.ejs", { myimage: req.query.image })
})


app.get("/wholeimage1", function (req, res) {
    image = "/public/askedquestion/" + req.query.image
    console.log(req.query.image)
    res.render("newimage.ejs", { myimage: req.query.image })
})
app.get("/wholeimage2", function (req, res) {
    image = "/public/answerimages/" + req.query.image
    console.log(req.query.image)
    res.render("newimage.ejs", { myimage: req.query.image })
})

app.get("/contactme", function (req, res) {
    res.render("contactme.ejs")
})

app.get("/chat", function (req, res) {
    res.render("room.ejs", { username: req.session.username })
})

app.get("/gchat", function (req, res) {
    res.render("room.ejs", { username: req.session.username })
})

app.post("/enterchat", function (req, res) {
    res.render('startchat.ejs', { username: req.body.username, roomid: req.body.roomid })
})

io.on("connection", function (socket) {
    console.log("user connected")
})
const rooms = {}
const botName = 'ChatCord Bot';
let room;
io.on("connection", function (socket) {
    socket.on('join-room', function (roomid, cb) {
        socket.join(roomid)
        room = roomid
        io.to(room).emit('new_message', `${cb} has joined`)
    })

    //------------------------------------------video chat-----------------------------------------
    socket.on("room", function (roomi) {
        socket.join(roomi)
    })
    socket.on('user joined', function (data) {
        rooms[data.room] = data.id
    })

    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        socket.emit('message', formatMessage(botName, 'Welcome to Mycoaching!'));
        socket.broadcast
            .to(user.room)
            .emit(
                'message',
                formatMessage(botName, `${user.username} has joined the chat`)
            );
        io.to(user.room).emit('roomUsers', {
            room: user.room
        });
    })


    socket.on("peerid", function (id, room) {
        io.to(room).emit("mypeerid", id, room)
    })

    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
        console.log("myyyyyyyy")
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if (user) {
            io.to(user.room).emit(
                'message',
                formatMessage(botName, `${user.username} has left the chat`)
            );
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });

    socket.on('yourstream', function (event, mroom, id) {
        console.log('this isssssssssssssssclick' + " " + event, mroom)
        io.to(mroom).emit("allstream", event, id)
    })

    socket.on('chat', message => {
        io.emit('chat', message)
    })

    socket.on("refresh", () => {
        console.log("fgzagf")

        io.emit("pagerefresh");
    })

    socket.on('screeningdata', function (data) {
        io.to(data.room).emit('screening', data.screenid)
    })
    socket.on('mouse', (data) => socket.broadcast.emit('mouse', data))
    socket.on('answer', ({ x, y, input }) => {
        console.log(x, y)
        io.emit('answer1', ({ x, y, input }))
    })
    io.emit('reload');
    socket.on("message", function (roomid, username, chat, fileinfo) {
        console.log("file is emitted")
        if (fileinfo != "") {
            let buff = new Buffer.from(fileinfo);
            let base64data = buff.toString('base64');
            io.to(room).emit('newdata', username, chat, base64data)
        }
        else {
            io.emit('newdata', username, chat, fileinfo)
        }
    })
})

app.get("/entervideochat", function (req, res) {
    res.render('Newchat.html');
})

app.post("/entervideochat", function (req, res) {
    res.render('chat.html', { user: req.body.username, room: req.body.room });
})

function middle(req, res, next) {
    MongoClient.connect(DATABASE, { useNewUrlParser: true }, function (error, client) {
        var blog = client.db("blog")
        blog.collection("users").findOne({
            $or: [
                {
                    "username": req.body.name,

                },
                {
                    "email": req.body.email,

                }
            ]
        }, function (error, data) {
            if (data) {

                res.send({
                    message: "Enter the unique username or password"
                })
            }
            else {
                req.username = req.body.name
                req.email = req.body.email
                next()
            }
        })
    })

}

function middle1(req, res, next) {
    MongoClient.connect(DATABASE, { useNewUrlParser: true }, function (error, client) {
        var blog = client.db("blog")
        blog.collection("users").findOne({
            "password": req.body.password,
        }, function (error, data) {
            if (data) {
                res.send({
                    message: "enter unique password"
                })
            }
            else {
                req.password = req.body.password
                next()
            }
        })
    })

}


app.post('/register', middle, middle1, async (req, res) => {
    if (req.email) {
        req.session.password = req.body.password
        payload = {
            username: req.body.name,
            email: req.email,
            Admin: false,
            password: req.body.password
        }
        const token = jwt.sign(payload, process.env.KEY_NEW, { expiresIn: '1hr' });
        var mailOptions = {
            from: "rav39439@gmail.com",
            to: req.body.email,
            subject: "signup successful",
            html: `<h2>${req.body.name}! Thanks for registering on our site</h2>
            <h4>Please verify your mail to continue</h4>
            <a href="http://localhost:8700/verify-email1?token=${token}">verify your email</a>
            `
        }
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error)
            } else {
                res.render("verify-email.ejs", { token: token })
                console.log("verificartion email is sent")
                console.log(req.email)
            }
        })
    }
    else {
        res.send("please logout to continue")
    }
})

app.get("/verify-email1", function (req, res) {
    if (req.query.token) {
        const decodedToken = jwt.verify(req.query.token, process.env.KEY_NEW)
        username = decodedToken.username
        email = decodedToken.email
        let password = decodedToken.password
        MongoClient.connect(DATABASE, { useNewUrlParser: true }, function (error, client) {
            var blog = client.db("blog")
            blog.collection("users").insertOne({
                "username": username,
                "password": password,
                "email": email,
                "Admin": false,
                "Joined": date.format((new Date(Date.now())),
                    'DD/MM/YYYY')
            }, function (err, data) {
            })
        })
        req.session.destroy()
        res.send("You are registered successfully . You can login now")
    }
    else {

    }

})

const PORT = process.env.PORT
http.listen(PORT || 8800, () => {
    console.log("listening")
})

app.get("/verify-email", function (req, res) {
    if (req.query.token) {
        const decodedToken = jwt.verify(req.query.token, process.env.KEY_NEW)
        username = decodedToken.username
        email = decodedToken.email
        if (decodedToken.isadmin == true) {
            req.session.username = decodedToken.username
            req.session.email = decodedToken.email
            req.session.isadmin = decodedToken.isadmin
            res.redirect('/')
        }
        else {
            req.session.destroy()
            res.send("something wrong please contact")
        }
    }
    else {
    }

})
