
const express = require('express')
const crypto=require('crypto')
const jwt=require('jsonwebtoken')
const nodemailer=require('nodemailer')
const app = express()
const { DATABASE } = process.env;
const { PASSWORD } = process.env;
const { KEYUSER } = process.env;
const { KEYHOST } = process.env;
//const PORT = process.env.PORT;
const date = require('date-and-time')
const sendgridtransport=require('nodemailer-sendgrid-transport')
const path = require("path")
const hbs = require("hbs")
require('dotenv').config()
const bcrypt = require('bcryptjs');
//const { urlencoded } = require('body-parser')
var bodyParser=require("body-parser")
app.use(bodyParser.urlencoded())
//app.use(bodyParser.json())




  //app.use(bodyParser.json())
//var cookieParser = require('cookie-parser');
//
//const { API_PORT } = process.env;
//const port = process.env.API_PORT;
//const ejs = require("hbs")
const formidable=require('formidable')
//var {getVideoDuration}=require('get-video-duration')
const {v4:uuidV4}=require('uuid');
//var webshot=require("webshot")



// const server = require('http').Server(app)
// const io = require('socket.io')(server)

const url = require('url');
//var bodyParser = require('body-parser')

//app.use(express.json())
//app.use(express.urlencoded())
//var Parser = require('node-html-parser');

const connection = require('./index')
const fs = require('fs')

const pathset = path.join(__dirname, "/Templates/partials")

const setpath = path.join(__dirname, "/Templates/views")
hbs.registerPartials(pathset)

//var router = express.Router()
//app.use(express.urlencoded({ extended: false }))
//app.use(bodyParser());

//var urlencodedParser = bodyParser.urlencoded({ extended: false })
var http=require("http").createServer(app)

var io=require("socket.io")(http, {
    cors: {
   origin: "https://neweducationworld.herokuapp.com",
    // origin: "http://localhost:8700",
      credentials: true
    }
  })

//---------------------------------------------------------------------------------------------
var session=require("express-session")

// const MySQLStore = require('express-mysql-session')(session);
// const options = {                 // setting connection options
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'testdb',
// };
// const sessionStore = new MySQLStore(options);
//----------------------------------------------------------------------------------------------
app.use(session({
    key:"admin",
    secret:"any random string",
   // store:sessionStore,
    resave: true, 
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}))

//const multer  = require('multer')
//const storage = multer.diskStorage({
  //  destination: function (req, file, cb) {
  //    cb(null, path.join(__dirname, '/public/myexamimage'))
 //   },
  //  filename: function (req, file, cb) {
  //    cb(null, file.fieldname + '--' + file.originalname)
  //  }
 // })
//const upload=multer({storage:storage})
let a = []
let data = {};
let givenname;
let givenage;
console.log(setpath)
app.set("view engine", "hbs")
app.set("view engine", "ejs")
app.set("views", setpath)
// function getUser(id,callBack){
//     database.collection("users").findOne({
//         "id":ObjectId(id)
//     },function(error,user){

// callBack(user)
//     });

// }


// myobj = { name: "abhis", job: "consultant" }

//app.use("/public",express.static(__dirname +"../public"))
//app.use("/public",express.static(__dirname +"/public"))

app.get('/public', express.static('public'));



app.get('/myhome', function (req, res) {
    connection.query("select * from usercomments", function (err, userdata, fields) {
        if (err) { throw (err) }
        console.log(userdata)
    res.render("index.ejs",{userdata:userdata,username:req.session.username})
   

})
})
app.get('/', function (req, res) {

    connection.query("select * from usercomments", function (err, userdata, fields) {
        if (err) { throw (err) }
        console.log(userdata)
    res.render("index.ejs",{userdata:userdata,username:req.session.username})

})
console.log(req.session.username)

})

function newmiddle(req,res,next){
    connection.query("select * from `users`", function (err, userdata, fields) {
        if (err) { throw (err) 
        }
        else{
            req.data=userdata

            next()



        }

})
}

function newmiddle1(req,res,next){
    let userdata= req.data
    for(let i=0;i<userdata.length;i++){

        if(req.body.uniquecode==userdata[i].uniquecode){
     
            bcrypt.compare(req.body.password, userdata[i].password, function(err, response) {
                if(err){
                 console.log(err)
                }
        
        
                 else{
                        req.session.email=userdata[i].email;
                        req.session.username=userdata[i].Name
                        req.session.uniquecode=userdata[i].uniquecode
                        req.session.isadmin=userdata[i].admin
        
                        req.session.isAuth=true
                           
                        next()
                        return
        
                 
                     }
        
            });
            

        }
    }

}


app.post('/login',newmiddle,newmiddle1, (req, res) => {
   

     
      console.log("login is running")           

  if(req.session.isAuth){
      res.redirect('/')

  }

  
   // console.log(req.session.username)
    ///res.redirect('/')
    // connection.query("select * from usercomments", function (err, userdata, fields) {
    //     if (err) { throw (err) }
    //    // data = JSON.parse(userdata)
    //     console.log(userdata)
    // res.render("index.ejs",{userdata:userdata,username:req.session.username})
   

//})


})
app.get('/Mysecrets', (req, res) => {

    
       // res.render("createquiz.hbs")
    

    if(req.session.username){
        connection.query('select * from quiztable', function (err, userdata, fields) {
            if (err) { throw (err) }
            data = JSON.stringify(userdata)
            res.render("listoftests.ejs",{username:req.session.username,quizdata:userdata})
           
            
        })
    }
    else{
        res.json({
            "status":"You are not loggedin.Please login to access content"
        })
    }
        //console.log(req.session.username)
        //console.log(req.query.Age)
   
})


app.get('/Explaination', (req, res) => {

    connection.query('select * from new_table', function (err, userdata, fields) {
        if (err) { throw (err) }
        data = JSON.stringify(userdata)
        res.render("quiz.hbs", { userd: data, Mynam: req.query.registration1, Myag: req.query.Age })
        console.log(req.query.registration1)
        console.log(req.query.Age)
       
    })
})


app.get('/login', (req, res) => {

    res.render("userinformation.ejs")
})


app.get('/createtable', (req, res) => {
    //if(req.body.code==process.env.KEY_CODE){
    res.render("createquiz.ejs")
   // }
})

app.post('/createtable',mymiddle,mymiddle2,(req, res) => {

//--------------------------------uniquetable identification-----------------------------------------

//connection.query("select  * from quiztable ", function (err, data1, fields) {
  //  if (err) { throw (err) }
//else{
   // data.forEach(function(elem){

      //  if(req.body.quizname==elem.quizname){
    //res.render("createquiz.hbs")
    //    }
      
  //  })
//}
//})

//--------------------------------------------------------------------------------------------------
    var sql = "CREATE TABLE " + req.body.quizname + " (numb INT primary key auto_increment, question VARCHAR(500)not null,queimg VARCHAR(500)not null ,answercode INT, option1 VARCHAR(500)not null,option2 VARCHAR(500)not null ,option3 VARCHAR(500)not null, option4 VARCHAR(500)not null ,solutions VARCHAR(5000)not null ,solutionsimg VARCHAR(5000)not null,myfiles VARCHAR(500)not null ,time INT ,beforetime INT,positivemarks INT,negativemarks INT)";
    connection.query(sql, function (err, userdata, fields) {
        if (err) { throw (err) }
        console.log("table created")
    })


    if(req.body.status=="public"){

        var mydat= "INSERT INTO `quiztable` (`quizname`, `createdby`, `examname`, `noofquestions`, `status`, `uniquecode`, `securepass`) VALUES ('" + req.body.quizname + "', '" + req.session.username + "', '" + req.body.examname + "', " + req.body.noofquestions + ", 'public','', '');"
    connection.query(mydat, function (err, result) {
        if (err) throw err;

        
    })
}
    if(req.body.status=="on"){

        var mydat= "INSERT INTO `quiztable` (`quizname`, `createdby`, `examname`, `noofquestions`, `status`, `uniquecode`, `securepass`) VALUES ('" + req.body.quizname + "', '" + req.session.username + "', '" + req.body.examname + "', " + req.body.noofquestions + ", 'hidden','" + req.session.uniquecode + "', '" + req.body.secretcode + "');"
    connection.query(mydat, function (err, result) {
        if (err) throw err;

        
    })
    

}
res.redirect("/postquestions")
})


app.get('/editquestions', (req, res) => {
    res.render("Editquestions.hbs")

})
app.post('/editquestions', (req, res) => {

    connection.query("select * from " + req.body.myno1 + " where numb>" + req.body.rangeno + "", function (err, data1, fields) {
        if (err) { throw (err) }
        data = JSON.stringify(data1)
        res.send(data1)
        //console.log(req.query.myno1)
        //console.log(req.query.Age)
        //console.log(data)

        //console.log(data1)


    })

})

app.get("/viewquestions",function(req,res){
   
 res.render("viewquestions.hbs")
})


app.get("/viewquestions1",function(req,res){

    connection.query("select * from " + req.query.myquiz + "", function (err, userdata, fields) {
        if (err) throw (err)
        data = JSON.stringify(userdata)
        res.render("viewquestions.hbs", { usedata: data })


    })


})




app.get('/postquestions', (req, res) => {
    res.render("postquestions.hbs")
})
app.post('/postquestions', (req, res) => {
    //res.render("postquestions.hbs", { gh: req.body.yourquiz,time:req.body.Mytime,beforetime:req.body.beforetime })


    var mydat = "INSERT INTO " + req.body.yourquiz + " (`numb`,`question`,`queimg`,`answercode`,`option1`,`option2`,`option3`,`option4`,`solutions`,`solutionsimg`,`myfiles`,`time`,`postquestions`,`negativemarks`) VALUES ('" + req.body.qno + "','" + req.body.myquestion + "','" + req.body.myquestionimg + "','" + req.body.answercode + "','" + req.body.myquestion1 + "','" + req.body.myquestion2 + "','" + req.body.myquestion3 + "','" + req.body.myquestion4 + "','" + req.body.Mysolutions + "','" + req.body.Mysolutionsimg + "', '" + req.body.myfile + "','" + req.body.mytime + "','" + req.body.pm + "','" + req.body.nm + "');";

    connection.query(mydat, function (err, result) {
        if (err) throw err;

        res.json({
            "message":"question submiited"
               })
    })

    //var mydata = "UPDATE testdb." + req.body.yourquiz + " SET time='" + req.body.mytime + "' WHERE numb='1'";

   // connection.query(mydata, function (err, result) {
      //  if (err) throw err;
       
   // })
   // var mydata = "UPDATE testdb." + req.body.yourquiz + " SET beforetime='" + req.body.beforetime + "' WHERE numb='1'";

    //connection.query(mydata, function (err, result) {
       // if (err){throw err} 
       // else{
           

       // }
   // })

})


// console.log(data)

//console.log(userdata)
app.post("/storeresult",  (req, res) => {

    var mydata = "UPDATE new_table1 SET " + req.body.quiz + "='" + req.body.marks + "' WHERE SNo='" + req.body.Myreg + "'";

    connection.query(mydata, function (err, result) {
        if (err) throw err;
        console.log("new record inserted");
    })
})

//----------------------------------trying sendgrid------------------------------------------------
var transporter=nodemailer.createTransport(sendgridtransport({
    
    auth:{
          api_key:'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',
        

    },
   

   
}))
//---------------------------------------------trying mailtrap-------------------------------------


// var transporter = nodemailer.createTransport({
//     host: "smtp.mailtrap.io",
//     port: 2525,
//     auth: {
//       user: "f764040d9ae9f9",
//       pass: "899f7d7a54bf30"
//     }
//   });








//--------------------------------------------------------------------------------------------

app.get('/register', (req, res) => {
    res.render("register.ejs",{username:req.session.username})
})

 function newmiddleware (req, res, next) {
    console.log("tesaquiehahdkhfk")
    
var g="select * from users"
    connection.query(g,function(err,data){
if(err){
    console.log(err)
}

    let s=0;
   
        console.log(data)
        data.forEach(function(elem){
    
           if(elem.uniquecode==req.body.uniquecode){
               //console.log(elem)

               s=s+1;
               
            }          
          
           
        })

        if(s==0){
           // console.log("dsfsf")
            next()
            return

        }
        else{
            res.render('register.ejs',{message:"unique code is not unique,enter different code",content:"uniquecode"})
        }
    
    })

  }
 function newmiddleware1 (req, res, next) {
    //console.log("tesaquiehahdkhfk")
    
var g="select * from users"
    connection.query(g,function(err,data){
if(err){
    console.log(err)
}

    let s=0;
   
       // console.log(data)
        data.forEach(function(elem){
    
           if(elem.email==req.body.email){
               //console.log(elem)

               s=s+1;
               
            }          
          
           
        })

        if(s==0){
           // console.log("dsfsf")
            next()
            return

        }
        else{
            res.render('register.ejs',{message:" email is already registered",content:"email"})
        }
    
    })

  }

  




app.post('/register',newmiddleware,newmiddleware1,(req, res) => {
    //     console.log(req.body)
    //    var sql = "INSERT INTO `new_table1` (`name`, `age`) VALUES ('"+req.body.Name+"','"+ req.body.Age+"')";
    //    //const sql = `INSERT INTO query_form (name, age) VALUES ('${req.body.name}', '${req.body.age}')`;
    //     connection.query(sql, function (err, result) {
    //         if (err) throw err;
    //         console.log("1 record inserted");
    // })
    //var file_name=req.file.filename;
    // console.log("dsfa")
    // var original_path=req.body.filename
    // var file_path="public/profileimages/"+req.body.filename;
    // console.log(original_path)
    // console.log(file_path)

    // fs.rename(original_path, file_path, function(err){
    //     // res.render("admin/posts",{imagepath:newPath})
    // console.log("profileimage updated")
    //  })
let k=""
let content=""
if(!req.session.email){
//console.log("adfasf")

payload={
    username:req.body.name,
    email:req.body.email,
    uniquecode:req.body.uniquecode,
    password:req.body.password,
}
    //const emailtoken=crypto.randomBytes(64).toString('hex')
    const token=jwt.sign(payload,process.env.KEY_NEW,{expiresIn:'1hr'});
    //console.log(token)
    //res.status(200).json({token})
    var mailOptions={
        from:"rav39439@gmail.com",
        to:req.body.email,
        subject:"signup successful",
        html:`<h2>${req.body.name}! Thanks for registering on our site</h2>
        <h4>Please verify your mail to continue</h4>
        <a href="https://neweducationworld.herokuapp.com/verify-email?token=${token}">verify your email</a>
        `
    }
    transporter.sendMail(mailOptions,function(error,info){
    
        if(error){
           console.log(error)
        }else{
            res.render("verify-email.ejs",{token:token})
            console.log("verificartion email is sent")
            console.log(req.body.email)

         // res.send("please check your mail and verify to register")
        }
   })



}
else{
    console.log(req.session.email)

    res.send("please logout to continue")
}
  

//else{


//res.render('userinformation.ejs')

//}
  
})


app.get("/verify-email",function(req,res){

  
///console.log(req.query.token)

if(req.query.token){
    const decodedToken=jwt.verify(req.query.token,process.env.KEY_NEW)
username=decodedToken.username
    uniquecode=decodedToken.uniquecode
   password=decodedToken.password
    email=decodedToken.email

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
    var c = "INSERT INTO `users` ( `Name`,`email`,`password`,`uniquecode`,`admin`,`isverified`,`token`) VALUES ('" +username+ "','" +email+ "','" + hash + "','" +uniquecode + "','true','true','"+req.query.token+"')";
    connection.query(c, (err, rows) => {
    if(err){
    console.log(err)
    }
    else{
        res.render("userinformation.ejs",{message:"You have successfully registered. Now you can proceed to login"})
    }

})
})
})
}
else{
    req.session.destroy()
    res.send("something wrong please contact")
}


    //bcrypt.genSalt(10, function(err, salt) {
     //   bcrypt.hash(req.body.password, salt, function(err, hash) {
            // const token = jwt.sign(
            //     { username: req.body.name, email:req.body.email },
            //     process.env.TOKEN_KEY,
            //     {
            //       expiresIn: "2h",
            //     }
            //   );
  
    //})
   // })





})




app.get("/takequiz", (req, res) => {

    res.render("readinfo1.hbs",{table2:req.query.examname,Myname:req.session.username,Myreg:req.session.uniquecode})
    console.log(req.query.newexam)


})

app.get("/readinformation", (req, res) => {

    connection.query("select * from " + req.query.newexam + "", function (err, userdata, fields) {
        if (err) { throw (err) }
        ydata = JSON.stringify(userdata)
        let gdata = JSON.stringify(req.query.newexam)

        res.render("readinfo.hbs", { student: req.query.studentname, reg: req.query.studentreg, quizname: req.query.newexam, newdata: ydata, mdata: gdata })
        console.log(req.query.studentname)
        ///console.log(student)
    })

})


app.get("/newquiz", (req, res) => {



    connection.query("select * from " + req.query.newexam + "", function (err, userdata, fields) {
        if (err) throw (err)
        data = JSON.stringify(userdata)
        res.render("newquiz1.hbs", { userd: data, student: req.query.studentname, reg: req.query.studentreg, quizname: req.query.newexam })
        userdata.forEach(function (element, index) {
            if (element.myfiles) {
                console.log(element.myfiles)
                fs.copyFile(`C:\\Users\\Dell\\Desktop\\New folder2\\${element.myfiles}.jpg`, `C:\\Users\\Dell\\Desktop\\node js\\connection\\public\\${element.myfiles}.jpg`, (err) => {
                    if (err) throw err;
                    console.log('source.txt was copied to destination.txt');
                });
            }
            // connection.close()

        })
        //console.log(req.query.registration1)
        // console.log(req.query.studentname)
        // console.log(req.query.studentreg)
        // console.log(req.query.newexam)
        //console.log(data)



    })

    console.log(req.url)
})

app.post("/storeresult1",  (req, res) => {
    // var doc = Parser.parse(req.body.Myresult, "text/html");
    //let hj=JSON.stringify()
    connection.query("select * from new_table", function (err, userdata, fields) {
        if (err) throw (err)
        data = JSON.stringify(userdata)
        res.render("myresults.hbs", { usedata: data })


    })


    // fetch(
    //  "http://localhost:8600/storeresult1",{headers: {
    //   'Content-Type': 'text/html'

    //  },"Accept": 'text/html'}
    //  )
    // .then((response) => response.text())
    // .then((data) => console.log(data))
    // .catch((err) => console.log(err));
    // var options={
    //   streamType:"png",
    //   windowSize:{
    //     width:1024,
    //     height:786
    //   },
    //  shotSize:{
    //   width:"all",
    //   height:"all"
    //  }


    // };
    //webshot("http://localhost:8600/storeresult1",options,(err)=>{
    //if(err){
    // console.log(err)
    //}

    //console.log("snapshots taken")










    //  fs.readFile(`C:\\Users\\Dell\\Desktop\\node js\\connection\\Templates\\views\\myresults.hbs`, 'utf8' , (err, data2) => {
    //     if (err) {
    //      console.error(err)

    //    }
    //else{

    //  var oldPath = `C:\\Users\\Dell\\Desktop\\node js\\connection\\src\\images1\\${req.body.Myage}.html`
    // fs.writeFile(oldPath, data2, (error) => {
    // if(error){
    ///  console.log(error)
    //  }
    // else{
    //   console.log("data written successfully")
    //  }

    //});
    // var oldPath = `C:\\Users\\Dell\\Desktop\\node js\\connection\\src\\images1\\${req.body.Myage}.html`
    // var newPath = `C:\\Users\\Dell\\Desktop\\New folder3\\${req.body.Myage}.html`

    // fs.rename(oldPath, newPath, function (err) {
    //  if (err) throw err
    //  console.log('Successfully renamed - AKA moved!')
    //})



    //}

    //})









    //return res.send('Done');





    //console.log(req.body.myresponses)
    // var mydat="INSERT INTO `testdb`.`new_table3` (`registration`,`Name`,`score`,`yourresult`) VALUES ('"+req.body.Myreg+"','"+req.body.Myage+"','"+req.body.marks+"','${req.body.Myage}.html');";

    /// connection.query(mydat, function (err, result) {
    //if (err) throw err;
    // console.log("new record inserted");
    //})
})
app.get("/viewresults", (req, res) => {
    connection.query("select * from new_table2", function (err, userdata, fields) {
        if (err) { throw (err) }
        data = JSON.stringify(userdata)


        //console.log(req.query.registration1)
        // console.log(req.query.studentname)
        // console.log(req.query.studentreg)
        // console.log(req.query.newexam)
        //console.log(data)

        res.render("viewresults", { datae: data })

    })

})

app.get("/finish", (req, res) => {
    res.render("finish")
    var sql = "DROP TABLE " + req.query.naquiz + "";
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Table deleted");
    });
})






//const upload = require('express-fileupload');
//const { allowedNodeEnvironmentFlags } = require('process');
const { json } = require('body-parser');
const { connect } = require('./index')
const { request } = require('http')
const { getMaxListeners } = require('process')
//const { result } = require('lodash')
//app.use(upload())

app.get("/fileupload", (req, res) => {
    res.render("upload.hbs")
})

app.post("/fileupload", (req, res) => {
    let samplepath;

    if (req.files) {
        console.log(req.files)
        const file = req.files.file
        filename = file.name

        extfile = path.extname(file.name)
        filename1 = path.basename(filename, extfile)
        console.log(filename)
        samplepath = __dirname + "/images1/" + file.name
        console.log(samplepath)
        file.mv(samplepath, function (err) {
            if (err) {
                res.send(err)
            }
            else {
                console.log("file uploaded")
            }
            //console.log(data1)
            var oldPath = `C:\\Users\\Dell\\Desktop\\node js\\connection\\src\\images1\\${file.name}`
            var newPath = `C:\\Users\\Dell\\Desktop\\New folder\\${file.name}`

            fs.rename(oldPath, newPath, function (err) {
                if (err) throw err
                console.log('Successfully renamed - AKA moved!')
            })

            //res.render("getdata",{namef:filename1})
            var c = "INSERT INTO `new_table2` (`registration`, `Name`,`score`,extof) VALUES (" + req.body.num + ", '" + filename1 + "','" + req.body.Mytext + "','" + extfile + "')";
            connection.query(c, (err, rows) => {

                if (err) {
                    console.log(err)
                }
                else {
                    console.log("file send")
                    console.log(filename1)
                }
            })


        })

    }
    res.render("upload.hbs")
})

app.get("/getdata", (req, res) => {

    connection.query("select * from new_table2", function (err, data) {
        if (err) { throw (err) }
        data1 = JSON.stringify(data)
        res.render("getdata.hbs", { data2: data1 })
        //console.log(data[12].Name)
        // console.log(req.query.myno1)
        //console.log(req.query.Age)
        //console.log(data)
        //console.log(req.body.Myname)




    })

})


app.post("/getdata", (req, res) => {
    let mytxt;
    connection.query("select * from new_table2", function (err, data) {
        if (err) { throw (err) }
        data.forEach(function (element, index) {
            if (data[index].Name == req.body.Myname) {

                mytxt = data[index].extof
            }
            fs.readFile(`C:\\Users\\Dell\\Desktop\\New folder\\${req.body.Myname}${mytxt}`, 'utf8', (err, data2) => {
                if (err) {
                    console.error(err)

                }
                else {
                    res.send(data2.toString())
                }



            })
        })

    })
})

a = []


app.post("/Mystorage", (req, res) => {

    console.log(req.body.Myname)

    //console.log(req.body.Myname0)
    //console.log(req.body.Myname1)
    console.log(req.body.na)
    console.log(req.body.marks)
    console.log(req.body.studentname)
    console.log(req.body.registation)
    //console.log(a)

    connection.query("ALTER TABLE " + req.body.na + " ADD " + req.body.studentname + " VARCHAR(500)", function (err, data) {
        if (err) {
            
            if(err.code == 'ER_DUP_ENTRY' || err.errno == 1062)
            {
                res.status(404).send("You have already attempted this exam")
            }
        
        
        }

        console.log("column created")
    })
    let a = req.body.Myname
    for (let i = 0; i < a.length; i++) {

        connection.query("UPDATE " + req.body.na + " SET " + req.body.studentname + "='" + req.body.Myname[i] + "' WHERE numb=" + (i + 1) + "", function (err, data) {
            if (err) { throw (err) }

            console.log("data added")
        })
    }




    



    ///--------------------------------------*********---------------------------------------------------


    // var sql = "CREATE TABLE dbrav." + req.body.na + " (regno INT primary key auto_increment, name VARCHAR(500)not null ,marks INT)"

    // connection.query(sql, function (err, userdata, fields) {
    //     if (err) {
    //         console.log("already created")
    //     }
    //     console.log(" new table created")
    // })

    // var c = "INSERT INTO dbrav." + req.body.na + " (`regno`, `name`,`marks`) VALUES (" + req.body.registation + ", '" + req.body.studentname + "','" + req.body.marks + "')";
    // connection.query(c, (err, rows) => {

    //     if (err) {
    //         console.log(err)
    //     }
    //     else {
    //         console.log("result is successfully added")
    //         //console.log(filename1)
    //     }
    // })


    //---------------------------------------------new way-----------------------------------------

    var c = "INSERT INTO myresult (`quizname`, `name`,`marks`) VALUES ('" + req.body.na + "','" + req.body.studentname + "','" + req.body.marks + "')";
     connection.query(c, (err, rows) => {

     if (err) {
            res.status(400).json({
                "message":"You have already attempted this test"
            })
        }
        else {
            console.log("result is successfully added")
             //console.log(filename1)
        }
    })

    res.render("finishexam.hbs",{name:req.body.studentname})

})


///--------------------------------------multilevelquiz----------------------------------------------

app.get("/multilevelquiz", (req, res) => {
    res.render("multiplelevel.hbs")
})
app.get("/readinfo1", (req, res) => {
    res.render("readinfo1.hbs", { Myname: req.query.Myname1, Myreg: req.query.regno1, table2: req.query.Myquiz })
})
app.post("/newquiz2", (req, res) => {
    connection.query("select * from " + req.body.Mytable2 + "", function (err, userdata, fields) {
        if (err) throw (err)
        data = JSON.stringify(userdata)
        res.render("newquiz2.hbs", { name2: req.body.Myname2, reg: req.body.registration, table2: req.body.Mytable2, userd: data })
        userdata.forEach(function (element, index) {
           ///if (element.myfiles) {
            //    console.log(element.myfiles)
             //   fs.copyFile(`C:\\Users\\Dell\\Desktop\\New folder2\\${element.myfiles}.jpg`, `C:\\Users\\Dell\\Desktop\\node js\\connection\\public\\${element.myfiles}.jpg`, (err) => {
                 //   if (err) throw err;
                //    console.log('source.txt was copied to destination.txt');
             //   });
           // }
            // connection.close()

        })
        //console.log(req.query.registration1)
        // console.log(req.query.studentname)
        // console.l


    })
})

function mymiddle(req,res,next){

    var mydat="select * from quiztable"
    connection.query(mydat,function(err,data){
req.adata=data
next()
    })
}

function mymiddle1(req,res,next){

    var data=req.adata

    let m=0
    data.forEach(function(elem){
        if(req.body.quizname==elem.quizname){
           m=m+1
        }else{
            m=0
        }
    })

if(m==0){
    next()
}else{
    res.render("multitable.ejs",{message:"Your quiz name is not unique . Please try with different name"})
}

}



function mymiddle2(req,res,next){

    var data=req.adata

    let m=0
    data.forEach(function(elem){
        if(req.body.quizname==elem.quizname){
           m=m+1
        }else{
            m=0
        }
    })

if(m==0){
    next()
}else{
    res.render("createquiz.ejs",{message:"Your quiz name is not unique . Please try with different name"})
}

}



function mymiddle3(req,res,next){

    var data=req.adata

    let m=0
    data.forEach(function(elem){
        if(req.body.quizname==elem.quizname){
           m=m+1
        }else{
            m=0
        }
    })

if(m==0){
    next()
}else{
    res.render("createnewtable.ejs",{message:"Your quiz name is not unique . Please try with different name"})
}

}











app.get('/multicreation', (req, res) => {
    res.render("multitable.ejs")
})
app.post('/multicreation',mymiddle,mymiddle1, (req, res) => {
   
    var sql = "CREATE TABLE " + req.body.quizname + " (numb INT primary key auto_increment, question VARCHAR(500)not null,queimg VARCHAR(200), answercode INT, option1 VARCHAR(500)not null,option2 VARCHAR(500)not null ,option3 VARCHAR(500)not null, option4 VARCHAR(500)not null ,solutions VARCHAR(5000)not null ,myfiles VARCHAR(500)not null ,time  VARCHAR(500) ,beforetime  VARCHAR(500) ,sections VARCHAR(500) ,qsection  VARCHAR(500),positivemark INT,Negativemark INT,solutionsimg VARCHAR(200))";
    connection.query(sql, function (err, userdata, fields) {
        if (err) { throw (err) }
        console.log("multitable created")
    })

    if(req.body.status=="public"){

        //var mydat = "INSERT INTO `quiztable` (`quizname`,`createdby`,`examname`,`noofquestions`,`status`) VALUES ('" + req.body.quizname + "','" + req.session.username + "','" + req.body.examname + "'," + req.body.noofquestions + ",'" + req.body.status + "');";
       var mydat= "INSERT INTO `quiztable` (`quizname`, `createdby`, `examname`, `noofquestions`, `status`, `uniquecode`, `securepass`) VALUES ('" + req.body.quizname + "', '" + req.session.username + "', '" + req.body.examname + "', " + req.body.noofquestions + ", '" + req.body.status + "', '', '');"
        connection.query(mydat, function (err, result) {
            if (err) {throw err}
            else{
    
                console.log(req.body.name);
            }
    
        })
    
    }
        else if(req.body.status=="on"){
    
       // var mydat = "INSERT INTO `quiztable` (`quizname`,`createdby`,`examname`,`uniquecode`,`securepass`,`noofquestions`,`status`) VALUES ('" + req.body.quizname + "','" + req.session.username + "','" + req.body.examname + "'," + req.session.uniquecode + ",'" + req.body.secretcode + "'," + req.body.noofquestions+ ",'hidden');";
        var mydat= "INSERT INTO `quiztable` (`quizname`, `createdby`, `examname`, `noofquestions`, `status`, `uniquecode`, `securepass`) VALUES ('" + req.body.quizname + "', '" + req.session.username + "', '" + req.body.examname + "', " + req.body.noofquestions + ", 'hidden','" + req.session.uniquecode + "', '" + req.body.secretcode + "');"
        connection.query(mydat, function (err, result) {
            if (err) {throw err}
            else{
    
                console.log(req.body.name);
            }
    
        })
    
    }
    res.redirect("/postmultiques")





})

app.get('/postmultiques', (req, res) => {

    res.render("postmultiple.hbs")
})
app.post('/postmultiques', (req, res) => {
    //res.render("postmultiple.hbs", { gh: req.body.yourquiz, subject: req.body.sections, queno: req.body.qsection, nos: req.body.no })


    //var mydat = "INSERT INTO `testdb`." + req.body.yourquiz + " (`numb`,`question`,`queimg`,`myfiles`,`solutionsimg`,`answercode`,`option1`,`option2`,`option3`,`option4`,`solutions`,`time`,`beforetime`,`postivemark`,`Negativemark`) VALUES (" + req.body.qno + ",'" + req.body.myquestion + "','" + req.body.myquestionimg+ "','" + req.body.myfiles + "','" + req.body.Mysolutionsimg + "','" + req.body.myquestionimg + "','" + req.body.answercode + "','" + req.body.myquestion1 + "','" + req.body.myquestion2 + "','" + req.body.myquestion3 + "','" + req.body.myquestion4 + "','" + req.body.Mysolutions + "','" + req.body.Mytime + "','" + req.body.beforetime + "','" + req.body.pm + "','" + req.body.nm + "')";
   var mydat= "INSERT INTO " + req.body.yourquiz + " (`numb`,`queimg`, `question`, `answercode`, `option1`, `option2`, `option3`, `option4`, `time`, `beforetime`, `sections`, `qsection`, `positivemark`, `Negativemark`, `solutionsimg`,`solutions`,`myfiles`) VALUES (" + req.body.qno + ",'"+req.body.myquestionimg+"','" + req.body.myquestion + "', '" + req.body.answercode + "', '" + req.body.myquestion1 + "', '" + req.body.myquestion2 + "', '" + req.body.myquestion3 + "', '" + req.body.myquestion4 + "', '" + req.body.Mytime + "', '" + req.body.beforetime + "', '" + req.body.sections + "', '" + req.body.qsection + "', '" + req.body.pm + "', '" + req.body.nm + "', '" + req.body.Mysolutionsimg + "','"+req.body.Mysolutions+"','"+req.body.myfiles+"');"
    connection.query(mydat, function (err, result) {
        if (err) {throw err}
        else{

            res.json({
                "message":"question submitted",
                
         
            })

        }

    })


    connection.query("UPDATE " + req.body.yourquiz + " SET sections='" + req.body.sections + "',qsection='" + req.body.qsection + "' WHERE numb=" + req.body.no + "", function (err, data) {
        if (err) { throw (err) }

        console.log("multidata added")
    })

})

app.post("/submitcomment",function(req,res){
    if(req.session.username){

    
    var mydat = "INSERT INTO `usercomments` (`image`,`usercomment`,`username`) VALUES ('Myimage','" + req.body.usercomment + "','" + req.session.username + "')";

    connection.query(mydat, function (err, result) {
        if (err) {throw err}
else{
        res.json({

            "message":"data saved",
            
            "usercomment":req.body.usercomment,
            "name":req.session.username
       
        })
    }
    })
    }
    else{
        res.json({
            "message":"Please login to comment"
        })
    }
})


//---------------------------------------------find your result-------------------------------------
app.get("/findresult",(req,res)=>{
    res.render("findmyresult.hbs")
})
app.post("/findresult",(req,res)=>{

    
    // give correct input for html
    
    


connection.query("select * from " + req.body.myquiz + "", function (err, userdata, fields) {
    if (err) throw (err)


    fs.readFile(`C:\\Users\\Dell\\OneDrive\\Desktop\\node js\\myquizapp\\Templates\\views\\myresults.hbs`, 'utf8', (err, data2) => {
        if (err) {
            console.error(err)
           // console.log("nofile")

        }
        else {
            otherdata = JSON.stringify(userdata)

            data3 = `${data2}

          <script>
          data=${otherdata}

          Mydata = Object.assign({}, data);
          let name="${req.body.name}"
         `


            var oldPath = `C:\\Users\\Dell\\OneDrive\\Desktop\\node js\\myquizapp\\src\\images1\\${req.body.myquiz}.html`
            fs.writeFile(oldPath, data3, (error) => {
                if (error) {
                    console.log(error)
                }
                else {
                    console.log("data written successfully")
                }

            })

            ///--------------------------------------------------------------------------

            fs.readFile(`C:\\Users\\Dell\\OneDrive\\Desktop\\node js\\myquizapp\\Templates\\views\\anotherfile.hbs`, 'utf8', (err, data4) => {
                if (err) {
                    console.error(err)

                }
                else {

                    var oldPath = `C:\\Users\\Dell\\OneDrive\\Desktop\\node js\\myquizapp\\src\\images1\\${req.body.myquiz}.html`
                    fs.appendFile(oldPath, data4, (error) => {
                        if (error) {
                            console.log(error)
                        }
                        else {
                            console.log("data appended successfully")
                          

                        }

                        var oldPath = `C:\\Users\\Dell\\OneDrive\\Desktop\\node js\\myquizapp\\src\\images1\\${req.body.myquiz}.html`
                        fs.readFile(`C:\\Users\\Dell\\OneDrive\\Desktop\\node js\\myquizapp\\src\\images1\\${req.body.myquiz}.html`, (err, data2) => {
                            if (err) {
                               
                        console.log(err)
                            }
                            else {
                               
                                res.writeHead(200, { 'Content-Type': 'text/html' });
                                res.write(data2)
                               
                            }
                        
                            res.end();
                            
                        
                        })



                    })
                }

            })
          ///----------------------------------------------------------------------------
        }

    })
})


})


app.get("/createsolutions",(req,res)=>{
    res.render("createsolutions.hbs")
})

app.get("/enterquizname",function(req,res){
    res.render("enterquizname.ejs",{username:req.session.username})
})
app.post("/enterquizname",function(req,res){
   
    connection.query("select * from hiddenquiz",function(err,data){
        console.log(req.body.securepass)
        console.log(req.body.secretcode)
     res.render("enterquizname.ejs",{data:data,uniquecode:req.body.uniquecode,pass:req.body.secretcode})
     console.log(JSON.stringify(data))
    })

})
app.get("/logout",function(req,res){
    req.session.destroy()
    res.redirect('/')
})

app.get("/findyourquizres",function(req,res){
   res.render("findyourquiz.ejs")
})

app.post("/findyourquizres",function(req,res){


    connection.query("select * from myresult", function (err, data) {
        if (err) { throw (err) }
       
        else{

            res.render("findyourquiz.ejs",{data:data,quizname:req.body.quizname})
        }
           
        
            })

})


//app.get("/Yourexam",function(req,res){

  
//})

app.get("/Yourexam",function(req,res){
   // console.log("dagdagda")
    connection.query("select * from `quiztable`", function (err, userdata, fields) {
        if (err) {
            res.render("nodata.hbs")
        }

else{
    console.log("your exam")
    res.render("yourquiz.ejs",{data:userdata,username:req.session.username,uniquecode:req.session.uniquecode})
}
})

})


app.get("/performance",function(req,res){

    connection.query("select * from myresult where uniquecode="+req.session.uniquecode+"", function (err, userdata, fields) {
        if (err) {
            res.render("nodata.hbs")
        }

else{
    res.render("performance.ejs",{data:userdata})
}
})



})




app.get("/SSCCGL",(req,res)=>{
    res.render("SSC")
})
app.get("/others",(req,res)=>{
res.resder("others")
})
app.get("/CDS",(req,res)=>{
res.render("CDS")
})
app.get("/CSIR",(req,res)=>{
res.render("CSIR")
})

app.post("/SSCCGL",(req,res)=>{
    res.render("SSC")
    var c = "INSERT INTO ssccgl (`id`, `question`,`option1`,`option2`,`option3`,`option4`,`solution`) VALUES ( "+ req.body.qno +", " + req.body.question + "," + req.body.option1 + ","+req.body.option2+", "+req.body.option3+", "+req.body.option4+", "+req.body.solution+")"
    connection.query(c, (err, rows) => {

        if (err) {
            console.log(err)
        }
        else {
            console.log("result is successfully added")
            //console.log(filename1)
        }
    })




})

app.post("/newquiz4result",function(req,res){
    console.log(req.body.studentname)
    console.log(req.body.quizname)
    console.log(req.body.regno)
    console.log(req.body.marks)
    //console.log(req.body.responses)

    connection.query("ALTER TABLE " + req.body.quizname + " ADD " + req.body.studentname +" JSON DEFAULT NULL", function (err, data) {
        if (err) {
            
            if(err.code == 'ER_DUP_ENTRY' || err.errno == 1062)
            {
                res.status(404).send("You have already attempted this exam")
            }
          
        
        }

        console.log("column created")
    })


let b=[]
    let a = JSON.parse(req.body.responses)
    console.log(a)


    for (let i = 0; i < a.length; i++) {
       
           // a[i]=JSON.stringify(a[i])
            if(Array.isArray(a[i])){

                var json_arr = {};
                let t= a[i]
                //for (let j = 0; i < a[j].length; j++)
                if(t[0]){

                    json_arr["answer1"] = t[0];
                }
                if(t[1]){

                    json_arr["answer2"] = t[1];
                }
                if(t[2]){
        json_arr["answer3"] = t[2]
                }
      

        let json = JSON.stringify(json_arr);
        b[i]=JSON.stringify(json)
               console.log(b[i])

            }
            else{
                b[i]=JSON.stringify(a[i])

            }
console.log(b)
        connection.query("UPDATE " + req.body.quizname + " SET " + req.body.studentname + "=" + b[i] + " WHERE numb=" + (i + 1) + "", function (err, data) {
            if (err) { throw (err) }

            console.log("data added")
        })
    }
//console.log(b)


           // try{
                connection.query("INSERT INTO myresult (`quizname`,`name`,`marks`) VALUES('"+req.body.quizname+"','"+req.body.studentname+"',"+req.body.marks+")", function (err, data) {
    
                

      //  } catch(e){
//console.log("Dsfs")
    //    }          
            
            
           if (err) {
               console.log(err.code)
            }
else{
    console.log("Result details has been added")

}







        })
    
    





})

app.get("/createnewtable",function(req,res){
    res.render("createnewtable.ejs")
})
app.post("/createnewtable",mymiddle,mymiddle3,function(req,res){

console.log(req.body.noofquestion)
console.log(req.body.quizname)
console.log(req.body.examname)
console.log(req.body.status)
    var sql = "CREATE TABLE " + req.body.quizname + " (numb INT primary key auto_increment, question VARCHAR(500)not null,queimg VARCHAR(500)not null,type VARCHAR(500)not null, answercode JSON DEFAULT NULL, option1 VARCHAR(500)not null,option2 VARCHAR(500)not null ,option3 VARCHAR(500)not null, option4 VARCHAR(500)not null ,solutions VARCHAR(5000)not null ,solutionsimg VARCHAR(500)not null,myfiles VARCHAR(500)not null ,time INT ,beforetime INT,qsection INT,sections VARCHAR(300),integerans INT,passage VARCHAR(5000)not null,passageimg VARCHAR(500)not null,positivemarks INT,negativemarks INT)";
    connection.query(sql, function (err, userdata, fields) {
        if (err) { throw (err) }
        else{

            console.log("table created")

        }
    })


    if(req.body.status=="public"){

        var mydat= "INSERT INTO `quiztable` (`quizname`, `createdby`, `examname`, `noofquestions`, `status`, `uniquecode`, `securepass`) VALUES ('" + req.body.quizname + "', '" + req.session.username + "', '" + req.body.examname + "', " + req.body.noofquestions + ", 'public','', '');"
    connection.query(mydat, function (err, result) {
        if (err) {throw err}
        else{

            console.log(req.body.name);
        }

    })

}
    else if(req.body.status=="on"){

        var mydat= "INSERT INTO `quiztable` (`quizname`, `createdby`, `examname`, `noofquestions`, `status`, `uniquecode`, `securepass`) VALUES ('" + req.body.quizname + "', '" + req.session.username + "', '" + req.body.examname + "', " + req.body.noofquestions + ", 'hidden','" + req.session.uniquecode + "', '" + req.body.secretcode + "');"
    connection.query(mydat, function (err, result) {
        if (err) {throw err}
        else{

            console.log(req.body.name);
        }

    })

}
res.render("postmultioptions.ejs")

})
app.get("/postmultioptions",function(req,res){

//console.log("thkhaeshalirhfahrf"+req.query.code)
    //if(req.query.code==process.env.KEY_CODE){
        res.render("postmultioptions.ejs")

    //}
})

app.post("/postmultioptions", (req, res) => {


    console.log(req.body)
    var answersobj={
        "answer1":req.body.answercode1,
        "answer2":req.body.answercode2,
        "answer3":req.body.answercode3,
    }

var newanswerobj=JSON.stringify(answersobj)
    //var mydat = "INSERT INTO `testdb`." + req.body.yourquiz + " (`numb`,`question`,`queimg`,`qsection`,`sections`,`type`,`answercode`,`option1`,`option2`,`option3`,`option4`,`solutions`,`solutionsimg`,`myfiles`,`time`,`beforetime`,`passage`,`passageimg`,`integerans`) VALUES (" + req.body.qno + ",'" + req.body.myquestion + "','" + req.body.myquestionimg + "',"+req.body.qsection+",'"+req.body.section+"','" + req.body.type + "','" + newanswerobj + "','" + req.body.myquestion1 + "','" + req.body.myquestion2 + "','" + req.body.myquestion3 + "','" + req.body.myquestion4 + "','" + req.body.Mysolutions + "','" + req.body.Mysolutionsimg + "','" + req.body.namefile + "'," + req.body.mytime + "," + req.body.beforetime + ",'" + req.body.passage + "','" + req.body.passageimg + "',"+ req.body.myinteger +");"
    var mydat="INSERT INTO `" + req.body.yourquiz + "` (`numb`,`question`, `queimg`, `type`, `answercode`, `option1`, `option2`, `option3`, `option4`, `solutions`, `solutionsimg`, `myfiles`, `time`, `beforetime`, `qsection`, `sections`, `integerans`, `passage`, `passageimg`,`positivemarks`,negativemarks) VALUES ('"+req.body.qno+"','" + req.body.myquestion + "', '" + req.body.myquestionimg + "', '" + req.body.type + "', '" + newanswerobj + "', '" + req.body.myquestion1 + "', '" + req.body.myquestion2 + "', '" + req.body.myquestion3 + "', '" + req.body.myquestion4 + "', '" + req.body.Mysolutions + "', '" + req.body.Mysolutionsimg + "', '" + req.body.myfiles + "', '" + req.body.mytime + "', '" + req.body.beforetime + "', '" + req.body.qsection + "', '" + req.body.section + "', '" + req.body.myinteger + "', '" + req.body.passage + "', '" + req.body.passageimg + "','" + req.body.pm + "','" + req.body.nm + "');"
    connection.query(mydat, function (err, result) {
        if (err) {throw err}
else{
    console.log("newmultidata added");
   // res.render("postmultioptions.ejs", { yourquiz: req.body.yourquiz, section: req.body.section, queno: req.body.qsection, nos: req.body.no ,beforetime:req.body.beforetime,mytime:req.body.mytime,type:req.body.type})

   res.json({
       "time":req.body.mytime,
       "type":req.body.type,
       "beforetime":req.body.beforetime

   })
}
        

    })
   // console.log("dsafagsfga")

    // connection.query("UPDATE " + req.body.yourquiz + " SET sections='" + req.body.section + "',qsection='" + req.body.qsection + "' WHERE numb=" + req.body.no + "", function (err, data) {
    //     if (err) { throw (err) }

        console.log("multidata added")
    //})

})
// /-------------------------------------result of multioptions quiz--------------------------------
app.get("/resultmulti",(req,res)=>{
    res.render("findmyresult.hbs")
})
app.post("/resultmulti",(req,res)=>{

connection.query("select * from " + req.body.myquiz + "", function (err, userdata, fields) {
    if (err) throw (err)


    fs.readFile(`C:\\Users\\Dell\\OneDrive\\Desktop\\node js\\myquizapp\\Templates\\views\\myresult1.hbs`, 'utf8', (err, data2) => {
        if (err) {
            console.error(err)
           // console.log("nofile")

        }
        else {
            otherdata = JSON.stringify(userdata)
newdata=JSON.parse(otherdata)
//console.log(otherdata[1].answercode)
            data3 = `${data2}

          <script>
          data=${otherdata}

          Mydata = Object.assign({}, data);
          let name="${req.body.name}"
         `


            var oldPath = `C:\\Users\\Dell\\OneDrive\\Desktop\\node js\\myquizapp\\src\\images1\\${req.body.myquiz}.html`
            fs.writeFile(oldPath, data3, (error) => {
                if (error) {
                    console.log(error)
                }
                else {
                    console.log("data written successfully")
                }

            })

            ///--------------------------------------------------------------------------

            fs.readFile(`C:\\Users\\Dell\\OneDrive\\Desktop\\node js\\myquizapp\\Templates\\views\\anotherfile1.hbs`, 'utf8', (err, data4) => {
                if (err) {
                    console.error(err)

                }
                else {

                    var oldPath = `C:\\Users\\Dell\\OneDrive\\Desktop\\node js\\myquizapp\\src\\images1\\${req.body.myquiz}.html`
                    fs.appendFile(oldPath, data4, (error) => {
                        if (error) {
                            console.log(error)
                        }
                        else {
                            console.log("data appended successfully")
                          

                        }

                        var oldPath = `C:\\Users\\Dell\\OneDrive\\Desktop\\node js\\myquizapp\\src\\images1\\${req.body.myquiz}.html`
                        fs.readFile(`C:\\Users\\Dell\\OneDrive\\Desktop\\node js\\myquizapp\\src\\images1\\${req.body.myquiz}.html`, (err, data2) => {
                            if (err) {
                               
                        console.log(err)
                            }
                            else {
                               
                                res.writeHead(200, { 'Content-Type': 'text/html' });
                                res.write(data2)
                               
                            }
                        
                            res.end();
                            
                        
                        })



                    })
                }

            })
          ///----------------------------------------------------------------------------
        }

    })
})


})



app.post("/Mysecrets",function(req,res){

   console.log(req.body.code)
    console.log(process.env.KEY_CODE)
    if(req.body.code==process.env.KEY_CODE){
        res.render("createquiz.ejs")
    }
})

app.get("/deletequiz",function(req,res){

    res.render("deletequiz.hbs")

})


function deletemid(req,res,next){
    var sql = "SELECT * FROM quiztable";
    connection.query(sql, function (err, result) {
if(err){
    console.log(err)
}
else{
    req.data=result
    next()
}
    })
}

app.post("/deletequiz",deletemid,function(req,res){


    var sql = "DROP TABLE " + req.body.quizname + "";
    connection.query(sql, function (err, result) {
        if (err){

            if(err.code == 'ER_BAD_TABLE_ERROR' || err.errno == 1062)
            {
                res.status(404).send("the table is already deleted")
            }
        }
        else{

            console.log("Table deleted");

        }
    });



    var newdata=req.data
    newdata.forEach(function(elem){

        if(elem.quizname==req.body.quizname){
            var myd="DELETE FROM quiztable WHERE id="+elem.id+""
            connection.query(myd,function(err,result){
                if(err){
                    throw(err)
                }
                else{
                    console.log("table deleted")
                }
            })
        }
        
    })


})






// app.post("/others",(req,res)=>{
//     res.render("others")
//     var c = "INSERT INTO others (`id`, `question`,`option1`,`option2`,`option3`,`option4`,`solution`) VALUES (" + req.body.qno + ", '" + req.body.question + "','" + req.body.option1 + "','"+req.body.option2+"', '"+req.body.option3+"', '"+req.body.option4+"', '"+req.body.solution+'");'
//     connection.query(c, (err, rows) => {

//         if (err) {
//             console.log(err)
//         }
//         else {
//             console.log("result is successfully added")
//             //console.log(filename1)
//         }
//     })

// })

app.get("/getquizresult",function(req,res){

    res.render("getquizresult.ejs",{username:req.session.username})
})

app.post("/getquizresult",function(req,res){

    connection.query("select * from myresult ORDER BY marks DESC",function(err,data){

        if(err){

        

        }else{

            res.render("getquizresult.ejs",{mydata:data,quizname:req.body.quizname})
        }

    })
})

//------------------------------------------------socket----------------------------------------



io.on("connection",function(socket){
    console.log("user connected")



})



app.get("/enterquiz",function(req,res){

        res.render("readinfo3.hbs",{Myname:req.session.username,Myreg:req.session.uniquecode})
})
app.get("/enterquiz4",function(req,res){

        res.render("readinfo2.hbs",{Myname:req.session.username,Myreg:req.session.uniquecode})
})


app.get("/enterquiz1",function(req,res){

    console.log("fdagaga")
console.log(req.query.quiz)
    if(req.query.quiz=="Highlevelexam"){

        res.render("readinfo3.hbs",{table2:req.query.myquiz,Myname:req.session.username,Myreg:req.session.uniquecode})

    }
   
    if(req.query.quiz=="Multisectionexam"){

        res.render("readinfo2.hbs",{table2:req.query.myquiz,Myname:req.session.username,Myreg:req.session.uniquecode})

    }
    if(req.query.quiz=="simplequiz"){

        res.render("readinfo1.hbs",{table2:req.query.myquiz,Myname:req.session.username,Myreg:req.session.uniquecode})

    }


    
})
app.get("/getresult",function(req,res){
    res.render("getresult.hbs",{username:req.session.username})
})
//app.post("/enterexam",function(req,res){

  //console.log(req.body.quiz)
//res.render("readinfo3.hbs",{table2:req.body.quiz})

    
//})



app.post("/newquiz3", (req, res) => {
    connection.query("select * from " + req.body.Mytable2 + "", function (err, userdata, fields) {
        if (err) throw (err)
        data = JSON.stringify(userdata)
        res.render("newquiz3.hbs", { name2: req.body.Myname2, reg: req.body.registration, table2: req.body.Mytable2, userd: data })
       // userdata.forEach(function (element, index) {
          //  if (element.myfiles) {
            //    console.log(element.myfiles)
             //   fs.copyFile(`C:\\Users\\Dell\\Desktop\\New folder2\\${element.myfiles}.png`, `C:\\Users\\Dell\\Desktop\\node js\\connection\\public\\${element.myfiles}.png`, (err) => {
               //     if (err) throw err;
                //    console.log('source.txt was copied to destination.txt');
            //    });
        //    }
          //     console.log(element.myfiles)
                //fs.copyFile(`C:\\Users\\Dell\\Desktop\\New folder2\\${element.queimg}.png`, `C:\\Users\\Dell\\Desktop\\node js\\connection\\public\\${element.myfiles}.png`, (err) => {
                //    if (err) {throw err}
                 //   else{

                //        console.log('source.txt was copied to destination.txt');
               //     }
              //  });
           // }
           // if (element.Mysolutionsimg) {
              //  console.log(element.myfiles)
               // fs.copyFile(`C:\\Users\\Dell\\Desktop\\New folder2\\${element.Mysolutionsimg}.png`, `C:\\Users\\Dell\\Desktop\\node js\\connection\\public\\${element.myfiles}.png`, (err) => {
                 //   if (err) {throw err}
                  //  else{

                 //       console.log('source.txt was copied to destination.txt');
               //     }
             //   });
          //  }
          


            // connection.close()

       // })
        //console.log(req.query.registration1)
        // console.log(req.query.studentname)
        // console.l
    })
})


app.post("/newquiz4", (req, res) => {
    connection.query("select * from " + req.body.Mytable2 + "", function (err, userdata, fields) {
        if (err) {
            throw (err)}
        data = JSON.stringify(userdata)
        res.render("newquiz4.hbs", { name2: req.body.Myname2, reg: req.body.registration, table2: req.body.Mytable2, userd: data })
       // userdata.forEach(function (element, index) {
         //   if (element.myfiles) {
            //    console.log(element.myfiles)
             //   fs.rename(`C:\\Users\\Dell\\Desktop\\New folder2\\${element.myfiles}.png`, `C:\\Users\\Dell\\Desktop\\node js\\connection\\public\\${element.myfiles}.png`, (err) => {
            //        if (err) throw err;
                 //   console.log('source.txt was copied to destination.txt');
            
              //  });
         ////   }
           // if (element.queimg) {
               // console.log(element.myfiles)
            //    fs.rename(`C:\\Users\\Dell\\Desktop\\New folder2\\${element.queimg}.png`, `C:\\Users\\Dell\\Desktop\\node js\\connection\\public\\${element.myfiles}.png`, (err) => {
             //       if (err) throw err;
             //       console.log('source.txt was copied to destination.txt');
            
             //   });
         //   }
         //   if (element.Mysolutionsimg) {
              //  console.log(element.myfiles)
            //    fs.rename(`C:\\Users\\Dell\\Desktop\\New folder2\\${element.Mysolutionsimg}.png`, `C:\\Users\\Dell\\Desktop\\node js\\connection\\public\\${element.myfiles}.png`, (err) => {
               //     if (err) throw err;
              //      console.log('source.txt was copied to destination.txt');
            //
         //       });
        //    }
          //  if (element.passageimg) {
            //    console.log(element.myfiles)
            //    fs.rename(`C:\\Users\\Dell\\OneDrive\\Desktop\\New folder2\\${element.passageimg}.png`, `C:\\Users\\Dell\\Desktop\\node js\\connection\\public\\${element.myfiles}.png`, (err) => {
             //       if (err) throw err;
              //      console.log('source.txt was copied to destination.txt');
            
            //    });
          //  }
          

       // })
      
    })
})

app.get("/getyourans",function(req,res){

    connection.query("select * from questionsposted", function (err, userdata, fields) {
        if (err) throw (err)
    
    var usedata=JSON.stringify(userdata)
          
res.render("postquestions.ejs",{usedata:usedata,userdata:userdata,name:req.session.username,uniquecode:req.session.uniquecode})
       
        })


    
})

app.post("/getyourans",function(req,res){


    const now  =  new Date();

    const value = date.format(now,'YYYY/MM/DD HH:mm:ss');

    var mydat = "INSERT INTO `questionsposted` (`questionasked`,`uniquecode`,`studentname`,`topic`,`tuniquecode`,`teachname`,`ansgiven`,`images`,`imageques`,`tfiles`,`files`,`date1`) VALUES ('" + req.body.questionasked + "','" + req.session.uniquecode + "','" + req.session.username + "','" + req.body.topic + "','" + req.body.tuniquecode + "','" + req.body.teachname + "' ,'','','"+req.body.questionimage+"','','"+req.body.myfile+"','"+value+"');";

    connection.query(mydat, function (err, result) {
        if (err) {throw err}
        else{
            console.log("question uploaded")
        }

        
    })
})

app.get("/getquestions",function(req,res){

    connection.query("select * from questionsposted", function (err, userdata, fields) {
        if (err) throw (err)
    
        var strdata=JSON.stringify(userdata)
    
          
res.render("getquestions.ejs",{strdata:strdata,userdata:userdata,name:req.session.username,uniquecode:req.session.uniquecode})
       
        })
})

app.post("/getquestions",function(req,res){

    console.log(req.body.ans)
    console.log(req.body.id)


    const now  =  new Date();

    const value = date.format(now,'YYYY/MM/DD HH:mm:ss');

     var mydata = "UPDATE questionsposted SET ansgiven='" + req.body.ans + "', images='"+req.body.myimageans+"',tfiles='"+req.body.myfile+"',date2='"+value+"' WHERE id='"+req.body.id+"'";

    connection.query(mydata, function (err, result) {
        if (err){ throw err}
        else{
            console.log("new record inserted");

        }
    })
})

app.get("/uploadcontent",function(req,res){
res.render("uploadcontent.ejs")

})
app.post("/uploadcontent" ,function(req,res){

   
if(req.body.status=="public"){
    var mydat="INSERT INTO uploadtab (`topic`,`content`,`uploadedby`,`uniquecode`,`data`,`filedata`,`status`,`secretcode`) VALUES('"+req.body.details+"','"+req.body.content+"','"+req.session.username+"','"+req.session.uniquecode+"','"+req.body.uploadimg+"','"+req.body.myfile+"','"+req.body.status+"','')"
    connection.query(mydat,function(err,result,fields){
if(err){
    console.log(err)
}else{
    res.json({
        "message":"data uploaded"
    })
}
    })

}

else{
    var mydat="INSERT INTO uploadtab (`topic`,`content`,`uploadedby`,`uniquecode`,`data`,`filedata`,`status`,`secretcode`) VALUES('"+req.body.details+"','"+req.body.content+"','"+req.session.username+"','"+req.session.uniquecode+"','"+req.body.uploadimg+"','"+req.body.myfile+"','"+req.body.status+"','"+req.body.secretcode+"')"
    connection.query(mydat,function(err,result,fields){
if(err){
    console.log(err)
}else{
    res.json({
        "message":"data uploaded"
    })
}
    })

}

   
})



app.post("/newresultmulti",(req,res)=>{

console.log(req.body.examname)
    if(req.body.examname=="Highlevelexam"){



        connection.query("select * from " + req.body.myquiz + "", function (err, userdata, fields) {
            if(!userdata){
                if(err.code == 'ER_NO_SUCH_TABLE' || err.errno == 1062)
                {
                    res.status(404).send("No results found")
                }
            }
          
            else{

           
            newdata=JSON.stringify(userdata)
            //console.log("result")
            res.render("resultfile.hbs",{usedata:newdata,name:req.body.name})
        }
            
        })
    }

else{
    connection.query("select * from " + req.body.myquiz + "", function (err, userdata, fields) {
        if (err) throw (err)
        
        newdata=JSON.stringify(userdata)
        console.log("result1")
        res.render("resultfile1.hbs",{usedata:newdata,name:req.body.name})
        
    })

}

        })



app.post("/do-uploadprofileimage",function(req,res){
    console.log("upload image is runing")
    var formData = new formidable.IncomingForm();
formData.parse(req,function(error,fields,files){
    var oldPath=files.file.path;
    var newPath="public/newimages/"+files.file.name;
    console.log(newPath)
    fs.copyFile(oldPath, newPath, function(err){
       // res.render("admin/posts",{imagepath:newPath})
       res.send("/"+ newPath)
    })
})
      

})
app.post("/do-uploadprofileimage1",function(req,res){
    console.log("upload image is runing")
    var formData = new formidable.IncomingForm();
formData.parse(req,function(error,fields,files){
    var oldPath=files.file.path;
    var newPath="public/newimages/"+files.file.name;
    console.log(newPath)
    fs.copyFile(oldPath, newPath, function(err){
       // res.render("admin/posts",{imagepath:newPath})
       res.send("/"+ newPath)
    })
})
      
          
    

})
app.post("/do-uploadprofileimage2",function(req,res){
    console.log("upload image is runing")
    var formData = new formidable.IncomingForm();
formData.parse(req,function(error,fields,files){
    var oldPath=files.file.path;
    var newPath="public/newimages/"+files.file.name;
    console.log(newPath)
    fs.copyFile(oldPath, newPath, function(err){
       // res.render("admin/posts",{imagepath:newPath})
       res.send("/"+ newPath)
    })
})
    
})



app.post("/do-uploadprofileimage3",function(req,res){
  //  var formData = new formidable.IncomingForm();
  console.log("upload image is runing")
  var formData = new formidable.IncomingForm();
formData.parse(req,function(error,fields,files){
  var oldPath=files.file.path;
  var newPath="public/newimages/"+files.file.name;
  console.log(newPath)
  fs.copyFile(oldPath, newPath, function(err){
     // res.render("admin/posts",{imagepath:newPath})
     res.send("/"+ newPath)
  })
})
})




app.post("/do-uploadprofileimage4",function(req,res){
  //  var formData = new formidable.IncomingForm();
  console.log("upload image is runing")
  var formData = new formidable.IncomingForm();
formData.parse(req,function(error,fields,files){
  var oldPath=files.file.path;
  var newPath="public/answerimages/"+files.file.name;
  console.log(newPath)
  fs.copyFile(oldPath, newPath, function(err){
     // res.render("admin/posts",{imagepath:newPath})
     res.send("/"+ newPath)
  })
})
})



app.post("/do-uploadprofileimage5",function(req,res){
  //  var formData = new formidable.IncomingForm();
  console.log("upload image is runing")
  var formData = new formidable.IncomingForm();
formData.parse(req,function(error,fields,files){
  var oldPath=files.file.path;
  var newPath="public/uploadedimages/"+files.file.name;
  console.log(newPath)
  fs.copyFile(oldPath, newPath, function(err){
     // res.render("admin/posts",{imagepath:newPath})
     res.send(files.file.name)
  })
})
})
app.post("/do-uploadpdffile",function(req,res){
  //  var formData = new formidable.IncomingForm();
  console.log("upload image is runing")
  var formData = new formidable.IncomingForm();
formData.parse(req,function(error,fields,files){
  var oldPath=files.file.path;
  var newPath="public/files/"+files.file.name;
  console.log(newPath)
  fs.copyFile(oldPath, newPath, function(err){
     // res.render("admin/posts",{imagepath:newPath})
     res.send(files.file.name)
  })
})
})


app.post("/do-uploadprofileimage6",function(req,res){
    //  var formData = new formidable.IncomingForm();
    console.log("upload image is runing")
    var formData = new formidable.IncomingForm();
  formData.parse(req,function(error,fields,files){
    var oldPath=files.file.path;
    var newPath="public/askedquestion/"+files.file.name;
    console.log(newPath)
    fs.copyFile(oldPath, newPath, function(err){
       // res.render("admin/posts",{imagepath:newPath})
       res.send("/"+ newPath)
    })
  })
  })






app.get("/getallcontent",function(req,res){

    res.render("getallcontent.ejs",{username:req.session.username})
})


  app.post("/getallcontent",function(req,res){


    var mydat="select * from uploadtab";
    connection.query(mydat,function(err,uploadedcontent,fields){


        if(err){
            throw(err)
        }
        else{
            console.log(uploadedcontent)
            res.render("getallcontent.ejs",{data:uploadedcontent,content:req.body.content})
        }
    })
  })  


  app.post("/do-block",function(req,res){

    //console.log(req.body.alldata)
    //console.log(JSON.stringify(req.body.uniquecode))
    //console.log(req.body.uniquecode)

    let newdata=JSON.parse(req.body.alldata)
    let k=req.body.alldata
   // let str=str = {"a":1}
   let m=req.body.uniquecode
   console.log(m)
  // console.log(newdata[1].uniquecode)
   


//console.log(a)
//console.log(b)
//let j=b[0]==a[0]
//console.log(j)

///console.log(h)
//console.log(Object.values(newdata[1])[h])
    for (let i=0;i<newdata.length;i++){
        //console.log(newdata[0].id)
        if(typeof(newdata[i])!='undefined'){

        if(newdata[i].uniquecode==req.body.uniquecode){

            console.log(newdata[i].id)
            var mydata = "UPDATE questionsposted SET status='blocked' WHERE id='"+newdata[i].id+"'";
       

    connection.query(mydata, function (err, result) {
        if (err){ throw err}
        else{
            console.log("user has been blocked");

        }
    })
}

}
}
      
  })
  app.post("/do-unblock",function(req,res){
    console.log(req.body.alldata)

    let newdata=JSON.parse(req.body.alldata)

    for (let i=0;i<newdata.length;i++){
        //console.log(newdata[0].id)
        if(typeof(newdata[i])!='undefined'){

        if(newdata[i].uniquecode==req.body.uniquecode){

            console.log(newdata[i].id)
            var mydata = "UPDATE questionsposted SET status='unblocked' WHERE id='"+newdata[i].id+"'";
       

    connection.query(mydata, function (err, result) {
        if (err){ throw err}
        else{
            console.log("user has been unblocked");

        }
    })
}
}
}
  })

function getdata(req,res,next){

    var data="select * from replies"
    connection.query(data,function(err,mydata){
        if(err){
            res.status(500).json({
                message:"something wrong"
            })

        }else{
            req.newdata=mydata
            next()
        }
    })
}









  app.post("/do-clear",getdata,function(req,res){
      //console.log(req.body.alldata)
    let newdata=JSON.parse(req.body.alldata)

    for (let i=0;i<newdata.length;i++){
        //console.log(newdata[0].id)

        if(newdata[i].questionasked==req.body.questionasked){

            //console.log(newdata[i].id)
            var mydata = "DELETE FROM questionsposted WHERE id='"+newdata[i].id+"'";
       

    connection.query(mydata, function (err, result) {
        if (err){ throw err}
        else{
            console.log("question has been cleared");

        }
    })
}

}


let newdatan=req.newdata
console.log(req.newdata)
console.log(req.body.commentid)
newdatan.forEach(function(elem,index){
    if(elem.commentid==req.body.commentid){
        console.log("found the reply")
        var data="DELETE from replies WHERE id='"+index+"'"
        connection.query(data,function(err,result){
            if(err){
                throw(err)
            }else{


               console.log("replies have been cleared")
               //req.session.mydata=""
            }
        })
    }
})
  })








    app.get("/test",function(req,res){
        res.render("test.ejs")
    })

    app.get("/introfile",function(req,res){
        console.log("introfile is running")
        var file=req.query.file;

        console.log(file)

            var filestream = fs.createReadStream(`./public/files/${file}`);                  
            res.writeHead(200, {
                "Content-Type":"application/pdf","Content-Transfer-Encoding": "binary"});
        
            filestream.on('data', function(chunk) {                     
                res.write(chunk);
                //console.log(chunk.toString())
            });
            filestream.on('end', function() {
                res.end();
            });
        
        })


        

    app.get("/images/:filename",function(req,res){
        console.log("introfile is running")
        var file=req.params.filename;

        console.log(file)

            var filestream = fs.createReadStream(`./public/uploadedimages/${file}`);                  
            res.writeHead(200, {
            });
        
            filestream.on('data', function(chunk) {                     
                res.write(chunk);
                //console.log(chunk.toString())
            });
            filestream.on('end', function() {
                res.end();
            });
        
        })


        app.get("/wholeimage",function(req,res){
            image="/public/uploadedimages/"+req.query.image
                console.log(req.query.image)
                res.render("newimage.ejs",{myimage:req.query.image})
            })

        app.get("/customimage",function(req,res){
            image="/public/uploadedimages/"+req.query.image
               // console.log(req.query.image)
                res.render("newimage1.ejs",{myimage:req.query.image})
            })


        app.get("/wholeimage1",function(req,res){
            image="/public/askedquestion/"+req.query.image
                console.log(req.query.image)
                res.render("newimage.ejs",{myimage:req.query.image})
            })
        app.get("/wholeimage2",function(req,res){
            image="/public/answerimages/"+req.query.image
                console.log(req.query.image)
                res.render("newimage.ejs",{myimage:req.query.image})
            })

            app.post("/do-reply",function(req,res){

                const now  =  new Date();

                const value = date.format(now,'YYYY/MM/DD HH:mm:ss');


                //var newdate=date.toISOString()

                var mydata="INSERT INTO replies (`commentid`,`name`,`reply`,`date`) VALUES('"+req.body.commentid+"','"+req.body.name+"','"+req.body.reply+"','"+value+"')"

                connection.query(mydata,function(err,result){
                    if(err){
                        throw(err)
                    }
                    else{
                        res.json({
                            "data":JSON.stringify(data)

                        })
                    }
                })
            })


            app.post("/do-getreply",function(req,res){


                var mydata="select * from replies";
                connection.query(mydata,function(err,data){
                    if(err){
                        throw(err)
                    }else{
                        res.json({
                            "data":JSON.stringify(data)

                        })
                    }
                })
            })

            app.get("/hiddencontent",function(req,res){
                console.log(req.session.isadmin)
                console.log(req.session.email)
                if(req.session.isadmin=="true"){

                    res.render("hiddencontent.ejs")
                }
                else{
                    res.json({
                        "message":"You are not admin. Kindly register as admin to access content"
                    })
                }




            })
            
            app.post("/hiddencontent",function(req,res){



                var mydat="select * from uploadtab"
                connection.query(mydat,function(err,data){

                    res.render("hiddencontent.ejs",{data:data,code:req.body.secretcode,uniquecode:req.body.uniquecode})
                })
            })


            app.get("/contactme",function(req,res){

                res.render("contactme.ejs")
            })


            app.get("/chat",function(req,res){

                res.render("room.ejs")
            })







            app.post("/enterchat",function(req,res){
                res.render('startchat.ejs',{username:req.body.username,roomid:req.body.roomid})   
            
            })


            let room;
            io.on("connection",function(socket){
               // console.log(socket.id)
               socket.on('join-room',function(roomid,cb){
                socket.join(roomid)
                ///cb(`joined ${room}`)
                 room=roomid

                io.to(room).emit('new_message',`${cb} has joined`)
            })
                socket.on("message",function(roomid,username,chat,fileinfo){

                    if(fileinfo!=""){
                        let buff = new Buffer.from(fileinfo);
                        let base64data = buff.toString('base64');
                    io.to(room).emit('newdata',username,chat,base64data)
                    }
                    else{


                        io.emit('newdata',username,chat,fileinfo)
                    }

                  

                   
                    
                })

            })









///-----------------------------------------------video-----------------------------------------------
  //---------------------------------------videoupload-------------------------------------------------
const PORT=process.env.PORT
  http.listen(PORT||8800, () => {
    console.log("listening")
})


