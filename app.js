
const express = require('express')
const crypto=require('crypto')
const jwt=require('jsonwebtoken')
const nodemailer=require('nodemailer')
const Qs = require('query-string');
const app = express()
const { DATABASE } = process.env;
const { PASSWORD } = process.env;
const { KEYUSER } = process.env;
const { KEYHOST } = process.env;
const date = require('date-and-time')
const sendgridtransport=require('nodemailer-sendgrid-transport')
const path = require("path")
const hbs = require("hbs")
require('dotenv').config()
const bcrypt = require('bcryptjs');
var bodyParser=require("body-parser")
app.use(bodyParser.urlencoded())

app.engine('html', require('ejs').renderFile);

const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
  } = require('./utils/users');
  const formatMessage = require('./utils/messeges');

  
const formidable=require('formidable')
const {v4:uuidV4}=require('uuid');


const url = require('url');


//const connection = require('./index')
const fs = require('fs')

const pathset = path.join(__dirname, "/Templates/partials")

const setpath = path.join(__dirname, "/Templates/views")
hbs.registerPartials(pathset)

// hbs.registerHelper( "when",function(operand_1, operator, operand_2, options) {
//     var operators = {
//      'eq': function(l,r) { return l == r; },
//      'noteq': function(l,r) { return l != r; },
//      'gt': function(l,r) { return Number(l) > Number(r); },
//      'or': function(l,r) { return l || r; },
//      'and': function(l,r) { return l && r; },
//      '%': function(l,r) { return (l % r) === 0; }
//     }
//     , result = operators[operator](operand_1,operand_2);
  
//     if (result) return options.fn(this);
//     else  return options.inverse(this);
//   });




  //--------------------mongodb-------------------------------------------------------------




var http=require("http").createServer(app)

var io=require("socket.io")(http, {
    cors: {
   origin: "https://neweducationworld.herokuapp.com",
    //origin: "http://localhost:8700",
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
    //connection.query("select * from usercomments", function (err, userdata, fields) {
    //     if (err) { throw (err) }
    //     console.log(userdata)
    // res.render("index.ejs",{userdata:userdata,username:req.session.username})
    // connection.end()

   

//})
})
app.get('/', function (req, res) {

    // connection.query("select * from usercomments", function (err, userdata, fields) {
    //     if (err) { throw (err) }
    //     console.log(userdata)
    // res.render("index.ejs",{userdata:userdata,username:req.session.username})
    // connection.end()

//})
//console.log(req.session.username)
    res.render("index.ejs",{username:req.session.username})

})

function newmiddle(req,res,next){

    //---------------------sql operation-----------------------------------------
//     connection.query("select * from `users`", function (err, userdata, fields) {
//         if (err) { throw (err) 
//         }
//         else{
//             req.data=userdata
//             next()

//         }
// })
//-----------------------------------------------------------------------------------
}



function newmiddle1(req,res,next){

    //---------------------------------------sql opreation-----------------------------
    // let userdata= req.data
    // for(let i=0;i<userdata.length;i++){

    //     if(req.body.uniquecode==userdata[i].uniquecode){
     
    //         bcrypt.compare(req.body.password, userdata[i].password, function(err, response) {
    //             if(err){
    //              console.log(err)
    //             }
        
        
    //              else{
    //                     req.session.email=userdata[i].email;
    //                     req.session.username=userdata[i].Name
    //                     req.session.uniquecode=userdata[i].uniquecode
    //                     req.session.isadmin=userdata[i].admin        
    //                     req.session.isAuth=true                          
    //                     next()
    //                     return                
    //                  }
        
    //         });
            

    //     }
    // }
//---------------------------------------------------------------------------------------
}


app.post('/login', (req, res) => {
 
   // console.log(req.body)   
MongoClient.connect("mongodb+srv://Ravkkrrttyy:xDKSBRRDI8nkn13w@cluster1.2pfid.mongodb.net/blog?retryWrites=true&w=majority",{useNewUrlParser:true},function(error,client){
    var blog=client.db("blog")
blog.collection("users").findOne({

    $and: [

        {
            "username":req.body.username,

        },
        {
            "password":req.body.password,

        }
    ]
    
},function(error,data){
    if(data){
        req.session.email=data.email;
        req.session.username=data.username
        req.session.isadmin=data.Admin
        console.log(req.session)
       res.redirect('/')
    }
    else{
    }
    
})
  
})
//-----------------------------------sql operation--------------------------------------------
//   if(req.session.isAuth){
//       res.redirect('/')
//   }
//--------------------------------------------------------------------------------------------
})











app.get('/Explaination', (req, res) => {
//---------------------------------sql operation--------------------------------------------
    // connection.query('select * from new_table', function (err, userdata, fields) {
    //     if (err) { throw (err) }
    //     data = JSON.stringify(userdata)
    //     res.render("quiz.hbs", { userd: data, Mynam: req.query.registration1, Myag: req.query.Age })
    //     console.log(req.query.registration1)
    //     console.log(req.query.Age)
       
    // })

    //--------------------------------sql operation-----------------------------------------
})


app.get('/login', (req, res) => {
    res.render("userinformation.ejs")
})


app.get('/createtable', (req, res) => {
    res.render("createquiz.ejs")
})

app.post('/createtable',(req, res) => {

    //-------------------------------sql operation---------------------------------------
//     var sql = "CREATE TABLE " + req.body.quizname + " (numb INT primary key auto_increment, question VARCHAR(500)not null,queimg VARCHAR(500)not null ,answercode INT, option1 VARCHAR(500)not null,option2 VARCHAR(500)not null ,option3 VARCHAR(500)not null, option4 VARCHAR(500)not null ,solutions VARCHAR(5000)not null ,solutionsimg VARCHAR(5000)not null,myfiles VARCHAR(500)not null ,time INT ,beforetime INT,positivemarks INT,negativemarks INT)";
//     connection.query(sql, function (err, userdata, fields) {
//         if (err) { throw (err) }
//         console.log("table created")
//     })


//     if(req.body.status=="public"){

//         var mydat= "INSERT INTO `quiztable` (`quizname`, `createdby`, `examname`, `noofquestions`, `status`, `uniquecode`, `securepass`) VALUES ('" + req.body.quizname + "', '" + req.session.username + "', '" + req.body.examname + "', " + req.body.noofquestions + ", 'public','', '');"
//     connection.query(mydat, function (err, result) {
//         if (err) throw err;

        
//     })
// }
//     if(req.body.status=="on"){

//         var mydat= "INSERT INTO `quiztable` (`quizname`, `createdby`, `examname`, `noofquestions`, `status`, `uniquecode`, `securepass`) VALUES ('" + req.body.quizname + "', '" + req.session.username + "', '" + req.body.examname + "', " + req.body.noofquestions + ", 'hidden','" + req.session.uniquecode + "', '" + req.body.secretcode + "');"
//     connection.query(mydat, function (err, result) {
//         if (err) throw err;

        
//     })
    

// }
// res.redirect("/postquestions")

//--------------------------------------------------------------------------------------------
})


app.get('/editquestions', (req, res) => {
    res.render("Editquestions.hbs")

})
app.post('/editquestions', (req, res) => {

    //-----------------------sql operation-----------------------------------------------
    // connection.query("select * from " + req.body.myno1 + " where numb>" + req.body.rangeno + "", function (err, data1, fields) {
    //     if (err) { throw (err) }
    //     data = JSON.stringify(data1)
    //     res.send(data1)
       
    // })
//----------------------------------------------------------------------------------------------
})

app.get("/viewquestions",function(req,res){
   
 res.render("viewquestions.hbs")
})


app.get("/viewquestions1",function(req,res){
    //-----------------------sql operation-----------------------------------------------

    // connection.query("select * from " + req.query.myquiz + "", function (err, userdata, fields) {
    //     if (err) throw (err)
    //     data = JSON.stringify(userdata)
    //     res.render("viewquestions.hbs", { usedata: data })


    // })
//-------------------------------------------------------------------------------------------

})




app.get('/postquestions', (req, res) => {
    res.render("postquestions.hbs")
})
app.post('/postquestions', (req, res) => {

//------------------not required-----------------------------
    // var mydat = "INSERT INTO " + req.body.yourquiz + " (`numb`,`question`,`queimg`,`answercode`,`option1`,`option2`,`option3`,`option4`,`solutions`,`solutionsimg`,`myfiles`,`time`,`postquestions`,`negativemarks`) VALUES ('" + req.body.qno + "','" + req.body.myquestion + "','" + req.body.myquestionimg + "','" + req.body.answercode + "','" + req.body.myquestion1 + "','" + req.body.myquestion2 + "','" + req.body.myquestion3 + "','" + req.body.myquestion4 + "','" + req.body.Mysolutions + "','" + req.body.Mysolutionsimg + "', '" + req.body.myfile + "','" + req.body.mytime + "','" + req.body.pm + "','" + req.body.nm + "');";

    // connection.query(mydat, function (err, result) {
    //     if (err) throw err;

    //     res.json({
    //         "message":"question submiited"
    //            })
    // })

})




//----------------------------------trying sendgrid------------------------------------------------
var transporter=nodemailer.createTransport(sendgridtransport({
    
    auth:{
          api_key:'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',
    },

   
}))


app.get('/register', (req, res) => {
    res.render("register.ejs",{username:req.session.username})
})


app.get("/viewresults", (req, res) => {
    // connection.query("select * from new_table2", function (err, userdata, fields) {
    //     if (err) { throw (err) }
    //     data = JSON.stringify(userdata)
    //     res.render("viewresults", { datae: data })
    // })
})



app.get("/fileupload", (req, res) => {
    res.render("upload.hbs")
})



app.get("/getdata", (req, res) => {

    // connection.query("select * from new_table2", function (err, data) {
    //     if (err) { throw (err) }
    //     data1 = JSON.stringify(data)
    //     res.render("getdata.hbs", { data2: data1 })
    // })

})


app.post("/getdata", (req, res) => {
    let mytxt;
    ////======================sql operation-----------------------------------------------
    // connection.query("select * from new_table2", function (err, data) {
    //     if (err) { throw (err) }
    //     data.forEach(function (element, index) {
    //         if (data[index].Name == req.body.Myname) {

    //             mytxt = data[index].extof
    //         }
    //         fs.readFile(`C:\\Users\\Dell\\Desktop\\New folder\\${req.body.Myname}${mytxt}`, 'utf8', (err, data2) => {
    //             if (err) {
    //                 console.error(err)
    //             }
    //             else {
    //                 res.send(data2.toString())
    //             }
    //         })
    //     })

    // })

    //------------------------------------------------------------------------------------
})





///--------------------------------------multilevelquiz----------------------------------------------

app.get("/multilevelquiz", (req, res) => {
    res.render("multiplelevel.hbs")
})
app.get("/readinfo1", (req, res) => {
    res.render("readinfo1.hbs", { Myname: req.query.Myname1, Myreg: req.query.regno1, table2: req.query.Myquiz })
})







//---------------------------------------------find your result-------------------------------------
app.get("/findresult",(req,res)=>{
    res.render("findmyresult.hbs")
})



app.get("/createsolutions",(req,res)=>{
    res.render("createsolutions.hbs")
})

app.get("/enterquizname",function(req,res){
    res.render("enterquizname.ejs",{username:req.session.username})
})
app.post("/enterquizname",function(req,res){
   //--------------------------------------sql operatioin---------------------------------
    // connection.query("select * from hiddenquiz",function(err,data){
    //     console.log(req.body.securepass)
    //     console.log(req.body.secretcode)
    //  res.render("enterquizname.ejs",{data:data,uniquecode:req.body.uniquecode,pass:req.body.secretcode})
    //  console.log(JSON.stringify(data))
    // })

    //--------------------------------------------------------------------------------------

})
app.get("/logout",function(req,res){
    req.session.destroy()
    res.redirect('/')
})





function getquizdata(req,res,next){
//-------------------------------sql query------------------------------------------------
    // connection.query("select * from myresult ORDER BY marks DESC",function(err,data){

    //     if(err){

    //     console.log(err)

    //     }else{
    //         req.quizdata=data
    //         next()

    //     }

    // })

    //-----------------------------------------------------------------------------------
}





//-------------------------------------xxxxxxxxxxxxx-------------------------------------------------------
//----------------------------------------newquizactions--------------------------------------
var MongoClient=require("mongodb").MongoClient;


MongoClient.connect("mongodb+srv://Ravkkrrttyy:xDKSBRRDI8nkn13w@cluster1.2pfid.mongodb.net/blog?retryWrites=true&w=majority",{useNewUrlParser:true},function(error,client){
  var blog=client.db("blog")
  console.log("DB connected")

})

app.post("/newquiz4", (req, res) => {

console.log(req.body.Mytable2)
    var MongoClient=require("mongodb").MongoClient;


    MongoClient.connect("mongodb+srv://Ravkkrrttyy:xDKSBRRDI8nkn13w@cluster1.2pfid.mongodb.net/blog?retryWrites=true&w=majority",{useNewUrlParser:true},function(error,client){
      var blog=client.db("blog")

      blog.collection("Quizzes").findOne({"quizname":req.body.Mytable2}, function(error,quiz){
        console.log(quiz)

        res.render("newquiz4.hbs",{userd:JSON.stringify(quiz.quizquestions),name2: req.body.Myname2, reg: req.body.registration, table2: req.body.Mytable2})
            })

})

    //-----------------------------------sql operation---------------------------------
    // connection.query("select * from " + req.body.Mytable2 + "", function (err, userdata, fields) {
    //     if (err) {
    //         throw (err)}
    //     data = JSON.stringify(userdata)
    //     res.render("newquiz4.hbs", { name2: req.body.Myname2, reg: req.body.registration, table2: req.body.Mytable2, userd: data })
//})
    //----------------------------------------------------------------------------------------
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




app.get('/Mysecrets', (req, res) => {
    console.log(req.session.isadmin)

    MongoClient.connect("mongodb+srv://Ravkkrrttyy:xDKSBRRDI8nkn13w@cluster1.2pfid.mongodb.net/blog?retryWrites=true&w=majority",{useNewUrlParser:true},function(error,client){
        var blog=client.db("blog")

        blog.collection("Quizzes").find().sort({_id:1}).toArray(function(error,quizzes){
           // console.log(quizzes)
            res.render("listoftests.ejs",{quizdata:quizzes,username:req.session.username,data:req.session})



    })
    })


//-------------------------------sql operation-----------------------------------------------
    // if(req.session.username){
    //     connection.query('select * from quiztable', function (err, userdata, fields) {
    //         if (err) { throw (err) }
    //         data = JSON.stringify(userdata)
    //         res.render("listoftests.ejs",{username:req.session.username,quizdata:userdata})
           
            
    //     })
    // }
    // else{
    //     res.json({
    //         "status":"You are not loggedin.Please login to access content"
    //     })
    // }
       
   //----------------------------------------------------------------------------------------
})


app.get('/secrets', (req, res) => {

    MongoClient.connect("mongodb+srv://Ravkkrrttyy:xDKSBRRDI8nkn13w@cluster1.2pfid.mongodb.net/blog?retryWrites=true&w=majority",{useNewUrlParser:true},function(error,client){
        var blog=client.db("blog")


        blog.collection("Quizzes").find().sort({_id:1}).toArray(function(error,quizzes){
            console.log(quizzes)
            res.render("tests.ejs",{quizdata:quizzes,username:req.session.username})
    })
    })
})


app.post("/getallcontent",function(req,res){


    MongoClient.connect("mongodb+srv://Ravkkrrttyy:xDKSBRRDI8nkn13w@cluster1.2pfid.mongodb.net/blog?retryWrites=true&w=majority",{useNewUrlParser:true},function(error,client){
        var blog=client.db("blog")

    blog.collection("studymaterial").find({
        "content":req.body.content
        
           }).toArray(function(error,content){
        
        console.log(content)
            res.render("getallcontent.ejs",{data:content,myfriendlist:JSON.stringify(req.session.friendlist)})
        })
        })

    //------------------------------------------------------------------------------------
//     var mydat="select * from uploadtab";
//     connection.query(mydat,function(err,uploadedcontent,fields){

// let b=[]
//         if(err){
//             throw(err)
//         }
//         else{
// console.log(req.body.content)
//             uploadedcontent.map(function(elem){
//                 if(elem.content==req.body.content){
//                     b.push(elem)
//                 }
//             })
//             console.log(b)
//             res.render("getallcontent.ejs",{data:b,content:req.body.content})
//         }
//     })


    //----------------------------------------------------------------------------------
  })  


app.post("/uploadcontent" ,function(req,res){  

    // if(req.body.status=="newpublic"){
console.log(req.body)
        MongoClient.connect("mongodb+srv://Ravkkrrttyy:xDKSBRRDI8nkn13w@cluster1.2pfid.mongodb.net/blog?retryWrites=true&w=majority",{useNewUrlParser:true},function(error,client){
            var blog=client.db("blog")

            blog.collection("studymaterial").insertOne({
        
                "topic":req.body.details,
                "content":req.body.content,
                "uploadedby":req.session.username,
                "uniquecode":req.session.uniquecode,
               
                "data":req.body.uploadimg,
                "filedata":req.body.myfile,
                "status":req.body.status,
                "secretcode":"",             
            },function(err,data){
                    res.json({
                       "message":"success",
                    
                    })
                    })
    
    })

    //---------------------------------------sql operation-----------------------------------
    //     var mydat="INSERT INTO uploadtab (`topic`,`content`,`uploadedby`,`uniquecode`,`data`,`filedata`,`status`,`secretcode`) VALUES('"+req.body.details+"','"+req.body.content+"','"+req.session.username+"','"+req.session.uniquecode+"','"+req.body.uploadimg+"','"+req.body.myfile+"','"+req.body.status+"','')"
    //     connection.query(mydat,function(err,result,fields){
    // if(err){
    //     console.log(err)
    // }else{
    //     res.json({
    //         "message":"data uploaded"
    //     })
    // }
    //     })
    // }
    // else{
    //     var mydat="INSERT INTO uploadtab (`topic`,`content`,`uploadedby`,`uniquecode`,`data`,`filedata`,`status`,`secretcode`) VALUES('"+req.body.details+"','"+req.body.content+"','"+req.session.username+"','"+req.session.uniquecode+"','"+req.body.uploadimg+"','"+req.body.myfile+"','"+req.body.status+"','"+req.body.secretcode+"')"
    //     connection.query(mydat,function(err,result,fields){
    // if(err){
    //     console.log(err)
    // }else{
    //     res.json({
    //         "message":"data uploaded"
    //     })
    // }
    //     })

    //----------------------------------------------------------------------------------
    // } 
     })

var arrayRankTransform=arr=>{
    const sorted=[...arr].sort((a,b)=>b.marks-a.marks)
    return arr.map((x)=>sorted.indexOf(x)+1)
}



//middleware 
app.post("/newresultmulti",(req,res)=>{

    if(req.body.examname=="Highlevelexam"){


        MongoClient.connect("mongodb+srv://Ravkkrrttyy:xDKSBRRDI8nkn13w@cluster1.2pfid.mongodb.net/blog?retryWrites=true&w=majority",{useNewUrlParser:true},function(error,client){
            var blog=client.db("blog")

            blog.collection("Quizzes").findOne({"quizname":req.body.myquiz}, function(error,quiz){

               let userresponses= quiz.quizattempters.find(elem=>elem.name==req.body.name)

const arrayranked=quiz.quizattempters.sort((a,b)=>b.marks-a.marks)
quiz.quizattempters.map((elem,index)=>{
    console.log("ranks are equzal")
    if(quiz.quizattempters[index]?.marks==quiz.quizattempters[index-1]?.marks){
        quiz.quizattempters[index-1]?.rank==index
        quiz.quizattempters[index]?.rank==index

    }
})

// console.log("ranks are")


// console.log(quiz.quizattempters)
let allmarks=[]
let studentranks=[]
quiz.quizattempters.forEach((elem)=>{
allmarks.push(elem.marks)
})

//console.log(marks)
const arr = [50, 39, 39, 32, 31];
const findRanks = (arr = []) => {
   const { length } = arr;
   let sortArray = arr.slice();
   sortArray.sort((a,b) => b - a);
   const result = [];
   for(let i = 0; i < length; i++){
      const j = sortArray.indexOf(arr[i])
      result.push(j + 1);
   }
   return result;
};
studentranks=findRanks(allmarks)
console.log(findRanks(allmarks));

                res.render("resultfile.ejs",{usedata:JSON.stringify(quiz.quizquestions),name:req.body.name,mydata:quiz.quizattempters,responses:JSON.stringify(userresponses),quizname:req.body.myquiz,ranks:studentranks})

                    })

          
          })
//-------------------------------------sql operations------------------------------------------
//         connection.query("select * from " + req.body.myquiz + "", function (err, userdata, fields) {
//             if(!userdata){
//                 if(err.code == 'ER_NO_SUCH_TABLE' || err.errno == 1062)
//                 {
//                     res.status(404).send("No results found")
//                 }
//             }
          
//             else{

//             newdata=JSON.stringify(userdata)
//             //console.log("result")
//             res.render("resultfile.ejs",{usedata:newdata,name:req.body.name,mydata:req.quizdata,quizname:req.body.myquiz})
//         }
            
//         })
//     }

// else{
//     connection.query("select * from " + req.body.myquiz + "", function (err, userdata, fields) {
//         if (err) throw (err)
        
//         newdata=JSON.stringify(userdata)
//         console.log("result1")
//         res.render("resultfile1.hbs",{usedata:newdata,name:req.body.name})
        
//     })

 }
//---------------------------------------------------------------------------------------------
        })


app.post("/postmultioptions", (req, res) => {

console.log("here are the questions")
    console.log(req.body)


    var answersobj={
        "answer1":req.body.answercode1,
        "answer2":req.body.answercode2,
        "answer3":req.body.answercode3,
    }

var newanswerobj=JSON.stringify(answersobj)

////---------------------------------update data in mongodb----------------------------

MongoClient.connect("mongodb+srv://Ravkkrrttyy:xDKSBRRDI8nkn13w@cluster1.2pfid.mongodb.net/blog?retryWrites=true&w=majority",{useNewUrlParser:true},function(error,client){
  var blog=client.db("blog")
blog.collection("Quizzes").updateOne({
    "quizname":req.body.yourquiz

},{
    $push:{
        "quizquestions":{
            numb:req.body.qno,
            question:req.body.myquestion,
            queimg:req.body.myquestionimg,
            type:req.body.type,
            answercode:newanswerobj,
            option1:req.body.myquestion1,
            option2:req.body.myquestion2,
            option3:req.body.myquestion3,
            option4:req.body.myquestion4,
            solution:req.body.Mysolutions,
            solutionsimg:req.body.Mysolutionsimg,
            myfile:req.body.myfiles,
            time:req.body.mytime,
            qsection:req.body.qsection,
section:req.body.section,
integerans:req.body.myinteger,
passage:req.body.passage,
passageimg:req.body.passageimg,
postivemarks:req.body.pm,
negativemarks:req.body.nm

        }
    }
}, function(err,data){
    res.json({
        "text":"successfully posted",
    })
});
});
//-------------------------------------sql operation----------------------------------------------------

//     var mydat="INSERT INTO `" + req.body.yourquiz + "` (`numb`,`question`, `queimg`, `type`, `answercode`, `option1`, `option2`, `option3`, `option4`, `solutions`, `solutionsimg`, `myfiles`, `time`, `beforetime`, `qsection`, `sections`, `integerans`, `passage`, `passageimg`,`positivemarks`,negativemarks) VALUES ('"+req.body.qno+"','" + req.body.myquestion + "', '" + req.body.myquestionimg + "', '" + req.body.type + "', '" + newanswerobj + "', '" + req.body.myquestion1 + "', '" + req.body.myquestion2 + "', '" + req.body.myquestion3 + "', '" + req.body.myquestion4 + "', '" + req.body.Mysolutions + "', '" + req.body.Mysolutionsimg + "', '" + req.body.myfiles + "', '" + req.body.mytime + "', '" + req.body.beforetime + "', '" + req.body.qsection + "', '" + req.body.section + "', '" + req.body.myinteger + "', '" + req.body.passage + "', '" + req.body.passageimg + "','" + req.body.pm + "','" + req.body.nm + "');"
//     connection.query(mydat, function (err, result) {
//         if (err) {throw err}
// else{
//     console.log("newmultidata added");

//    res.json({
//        "time":req.body.mytime,
//        "type":req.body.type,
//        "beforetime":req.body.beforetime

//    })
// }
        
// console.log("multidata added")
//     })


    //---------------------------------------------------------------------------------------
   // console.log("dsafagsfga")

    // connection.query("UPDATE " + req.body.yourquiz + " SET sections='" + req.body.section + "',qsection='" + req.body.qsection + "' WHERE numb=" + req.body.no + "", function (err, data) {
    //     if (err) { throw (err) }

        // 
    //})

})


app.post("/newquiz4result",function(req,res){
    

//----------------------------------updating quizquestions of quiz------------------------
let g=[]

    let b=[]
    b.push(1)
    let a = JSON.parse(req.body.responses)
console.log(b)
console.log(a)

    for (let i = 0; i < a.length; i++) {
       
            if(Array.isArray(a[i])){

                var json_arr = {};
                let t= a[i]
                if(t[0]){

                    json_arr["answer1"] = t[0];
                }
                if(t[1]){

                    json_arr["answer2"] = t[1];
                }
                if(t[2]){
        json_arr["answer3"] = t[2]
                }
      

     let json = json_arr;
        b[i]=json

            }
            else{
                b[i]=a[i]


            }

 g.push(b[i])

    }
//-------------------------------------updating quizdata here----------------------===========
MongoClient.connect("mongodb+srv://Ravkkrrttyy:xDKSBRRDI8nkn13w@cluster1.2pfid.mongodb.net/blog?retryWrites=true&w=majority",{useNewUrlParser:true},function(error,client){
  var blog=client.db("blog")

blog.collection("Quizzes").updateOne({
    "quizname":req.body.quizname

},{
    $push:{
        "quizattempters":{
        name:req.body.studentname,
        answers:g,
        marks:req.body.marks,
        rank:""

        }
    }
}, function(err,data){
    res.json({
        "text":"successfully posted",
    })
});

});

//-------------------------------------using sql------------------------------------------------
    // connection.query("ALTER TABLE " + req.body.quizname + " ADD " + req.body.studentname +" JSON DEFAULT NULL", function (err, data) {
    //     if (err) {
            
    //         if(err.code == 'ER_DUP_ENTRY' || err.errno == 1062)
    //         {
    //             res.status(404).send("You have already attempted this exam")
    //         }
          
        
    //     }

    //     console.log("column created")
    // })

// let b=[]
//     let a = JSON.parse(req.body.responses)


//     for (let i = 0; i < a.length; i++) {
       
//            // a[i]=JSON.stringify(a[i])
//             if(Array.isArray(a[i])){

//                 var json_arr = {};
//                 let t= a[i]
//                 //for (let j = 0; i < a[j].length; j++)
//                 if(t[0]){

//                     json_arr["answer1"] = t[0];
//                 }
//                 if(t[1]){

//                     json_arr["answer2"] = t[1];
//                 }
//                 if(t[2]){
//         json_arr["answer3"] = t[2]
//                 }
      

//         let json = JSON.stringify(json_arr);
//         b[i]=JSON.stringify(json)
//               // console.log(b[i])

//             }
//             else{
//                 b[i]=JSON.stringify(a[i])

//             }
// g.push(b[i])
//         connection.query("UPDATE " + req.body.quizname + " SET " + req.body.studentname + "=" + b[i] + " WHERE numb=" + (i + 1) + "", function (err, data) {
//             if (err) { throw (err) }

//             console.log("data added")
//         })
//     }
//     index = req.quizdata.find(x => x.name ==req.body.studentname && x.quizname==req.body.quizname);


// if(index){
//     connection.query("UPDATE myresult SET marks='"+req.body.marks+"' WHERE id="+(index.id)+"", function (err, data) {
               
//        if (err) {
//            console.log(err.code)
//         }
// else{
// console.log("result updated")

// }
// })

// }
    
// else{
//     connection.query("INSERT INTO myresult (`quizname`,`name`,`marks`) VALUES('"+req.body.quizname+"','"+req.body.studentname+"',"+req.body.marks+")", function (err, data) {
               
//         if (err) {
//             console.log(err.code)
//          }
// else{
// }
// })
// }   
//       res.send("submitted")

//-------------------------------------------------------------------------------------------
})







app.get("/createnewtable",function(req,res){
    res.render("createnewtable.ejs")
})

//mymiddle, mymiddle3
app.post("/createnewtable",function(req,res){

//--------------------------------------inserting data in mongodb-------------------------------------------------

MongoClient.connect("mongodb+srv://Ravkkrrttyy:xDKSBRRDI8nkn13w@cluster1.2pfid.mongodb.net/blog?retryWrites=true&w=majority",{useNewUrlParser:true},function(error,client){
  var blog=client.db("blog")



blog.collection("Quizzes").insertOne

    
({
    "quizname":req.body.quizname,
    "exam":req.body.exam,
    "examname":req.body.examname,
    "noofquestions":req.body.noofquestions,
    "status":"public",
    "quizquestions":[],
    "quizattempters":[]

},

function(error,document){

res.redirect("/")


})

})



//------------------------------------using sql queries-----------------------------------------------


//     var sql = "CREATE TABLE " + req.body.quizname + " (numb INT primary key auto_increment, question VARCHAR(500)not null,queimg VARCHAR(500)not null,type VARCHAR(500)not null, answercode JSON DEFAULT NULL, option1 VARCHAR(500)not null,option2 VARCHAR(500)not null ,option3 VARCHAR(500)not null, option4 VARCHAR(500)not null ,solutions VARCHAR(5000)not null ,solutionsimg VARCHAR(500)not null,myfiles VARCHAR(500)not null ,time INT ,beforetime INT,qsection INT,sections VARCHAR(300),integerans INT,passage VARCHAR(5000)not null,passageimg VARCHAR(500)not null,positivemarks INT,negativemarks INT)";
//     connection.query(sql, function (err, userdata, fields) {
//         if (err) { throw (err) }
//         else{

//             console.log("table created")

//         }
//     })


//     if(req.body.status=="public"){

//         var mydat= "INSERT INTO `quiztable` (`quizname`, `createdby`, `examname`, `noofquestions`, `status`, `uniquecode`, `securepass`) VALUES ('" + req.body.quizname + "', '" + req.session.username + "', '" + req.body.examname + "', " + req.body.noofquestions + ", 'public','', '');"
//     connection.query(mydat, function (err, result) {
//         if (err) {throw err}
//         else{

//             console.log(req.body.name);
//         }

//     })

// }
//     else if(req.body.status=="on"){

//         var mydat= "INSERT INTO `quiztable` (`quizname`, `createdby`, `examname`, `noofquestions`, `status`, `uniquecode`, `securepass`) VALUES ('" + req.body.quizname + "', '" + req.session.username + "', '" + req.body.examname + "', " + req.body.noofquestions + ", 'hidden','" + req.session.uniquecode + "', '" + req.body.secretcode + "');"
//     connection.query(mydat, function (err, result) {
//         if (err) {throw err}
//         else{

//             console.log(req.body.name);
//         }

//     })

// }

//--------------------------------------------------------------------------------------------
res.render("postmultioptions.ejs")

})


//---------------------------------------------------------------------------------------------

//------------------------------------xxxxxxxxxxxxxxxxxxxxxxxxxxx------------------------------------------------------



app.get("/postmultioptions",function(req,res){

//console.log("thkhaeshalirhfahrf"+req.query.code)
    //if(req.query.code==process.env.KEY_CODE){
        res.render("postmultioptions.ejs")

    //}
})


// /-------------------------------------result of multioptions quiz--------------------------------




app.post("/Mysecrets",function(req,res){

    if(req.body.code==process.env.KEY_CODE){
        res.render("createquiz.ejs")
    }
})

app.get("/deletequiz",function(req,res){

    res.render("deletequiz.hbs")

})


function deletemid(req,res,next){


    //------------------------------sql operation------------------------------------
//     var sql = "SELECT * FROM quiztable";
//     connection.query(sql, function (err, result) {
// if(err){
//     console.log(err)
// }
// else{
//     req.data=result
//     next()
// }
//     })

//--------------------------------------------------------------------------------
}

app.post("/deletequiz",function(req,res){

    MongoClient.connect("mongodb+srv://Ravkkrrttyy:xDKSBRRDI8nkn13w@cluster1.2pfid.mongodb.net/blog?retryWrites=true&w=majority",{useNewUrlParser:true},function(error,client){
        var blog=client.db("blog")
      
      
      
      blog.collection("Quizzes").deleteOne(
      
        
        { quizname:req.body.quizname },function(error,data){
            res.send("Data deleted")
        })
        })




//-=---------------------------------sql operation----------------------------------------
    // var sql = "DROP TABLE " + req.body.quizname + "";
    // connection.query(sql, function (err, result) {
    //     if (err){

    //         if(err.code == 'ER_BAD_TABLE_ERROR' || err.errno == 1062)
    //         {
    //             res.status(404).send("the table is already deleted")
    //         }
    //     }
    //     else{

    //         console.log("Table deleted");

    //     }
    // });



    // var newdata=req.data
    // newdata.forEach(function(elem){

    //     if(elem.quizname==req.body.quizname){
    //         var myd="DELETE FROM quiztable WHERE id="+elem.id+""
    //         connection.query(myd,function(err,result){
    //             if(err){
    //                 throw(err)
    //             }
    //             else{
    //                 console.log("table deleted")
    //             }
    //         })
    //     }
        
    // })
//---------------------------------------------------------------------------------------------

})


app.get("/getquizresult",function(req,res){

    MongoClient.connect("mongodb+srv://Ravkkrrttyy:xDKSBRRDI8nkn13w@cluster1.2pfid.mongodb.net/blog?retryWrites=true&w=majority",{useNewUrlParser:true},function(error,client){
        var blog=client.db("blog")

        blog.collection("Quizzes").find().sort({_id:1}).toArray(function(error,quizzes){


            
    res.render("getquizresult.ejs",{quizdata:quizzes})

    })
})





//------------------------------------sql operation--------------------------------------
  

// connection.query("select * from myresult ORDER BY marks DESC",function(err,data){

    //     if(err){

        

    //     }else{

    //         res.render("getquizresult.ejs",{mydata:data,quizname:req.body.quizname})
    //     }

    // })

    //-------------------------------------------------------------------------------------
})


app.post("/getquizresult",function(req,res){

    console.log(req.body.quizname)
    MongoClient.connect("mongodb+srv://Ravkkrrttyy:xDKSBRRDI8nkn13w@cluster1.2pfid.mongodb.net/blog?retryWrites=true&w=majority",{useNewUrlParser:true},function(error,client){
        var blog=client.db("blog")
  
        blog.collection("Quizzes").findOne({"quizname":req.body.quizname}, function(error,quiz){
            res.render("newresultfile.ejs",{Mydata:JSON.stringify(quiz.quizquestions),quizname:req.body.quizname})

    })
    })
    })

app.get("/updatequiz",function(req,res){

    MongoClient.connect("mongodb+srv://Ravkkrrttyy:xDKSBRRDI8nkn13w@cluster1.2pfid.mongodb.net/blog?retryWrites=true&w=majority",{useNewUrlParser:true},function(error,client){
        var blog=client.db("blog")

        blog.collection("Quizzes").find().sort().toArray(function(error,quizzes){

            
    res.render("updatelist.ejs",{quizdata:quizzes,username:req.session.username,data:req.session})

    })
    })

    

})

    app.post("/updatequiz",function(req,res){
console.log(req.body.status)
        MongoClient.connect("mongodb+srv://Ravkkrrttyy:xDKSBRRDI8nkn13w@cluster1.2pfid.mongodb.net/blog?retryWrites=true&w=majority",{useNewUrlParser:true},function(error,client){
            var blog=client.db("blog")
    
        blog.collection("Quizzes").updateOne({
            "quizname":req.body.myquiz
        },{
            $set:{
                "status":req.body.status
            }
        },function(err,data){
            res.json({
                "message":"quiz result is public"
            })
        })
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

    if(req.query.quiz=="Highlevelexam"){
console.log(req.body.Mytable2)
        MongoClient.connect("mongodb+srv://Ravkkrrttyy:xDKSBRRDI8nkn13w@cluster1.2pfid.mongodb.net/blog?retryWrites=true&w=majority",{useNewUrlParser:true},function(error,client){
            var blog=client.db("blog")
      
            blog.collection("Quizzes").findOne({"quizname":req.query.myquiz}, function(error,quiz){
              let data=quiz
              let section1length=0;
              let section2length=0;
            let  section3length=0
              let section4length=0

              if(parseInt(data.nsection)==4){
                 section1length=data.quizquestions[0].qsection
                 section2length=data.quizquestions[section1length].qsection
                 section3length=data.quizquestions[parseInt(section2length)+parseInt(section1length)].qsection
                 section4length=data.quizquestions[parseInt(section2length)+parseInt(section1length)+parseInt(section3length)].qsection
                 console.log(section4length)
          console.log(parseInt(section2length)+parseInt(section1length)+parseInt(section3length))
              }
              else if(parseInt(data.nsection)==3){
                section1length=data.quizquestions[0].qsection
             section2length=data.quizquestions[section1length].qsection
             console.log("these are the lengths")
            //console.log(parseInt(section2length)+parseInt(section1length))
             console.log(data.quizquestions[14])
                section3length=data.quizquestions[parseInt(section2length)+parseInt(section1length)].qsection
              }

              else if(parseInt(data.nsection)==2){
             section1length=data.quizquestions[0]?.qsection
             section2length=data.quizquestions[section1length]?.qsection
              }

              else{
             section1length=data.quizquestions[0].qsection
              }
     
              res.render("readinfo3.ejs", { 
                table2: req.query.myquiz,quiz:quiz,
                 Myname:req.session.username, 
                Myreg: req.session.uniquecode,
                section1length:section1length,
                section2length:section2length
            ,section3length:section3length,section4length:section4length })
            })
                  })



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


app.get("/uploadcontent",function(req,res){
res.render("uploadcontent.ejs")

})



app.post("/do-uploadprofileimage",function(req,res){
    console.log("upload image is runing")
    var formData = new formidable.IncomingForm();
formData.parse(req,function(error,fields,files){
    var oldPath=files.file.path;
    var newPath="public/newimages/"+files.file.name;
    console.log(newPath)
    fs.copyFile(oldPath, newPath, function(err){
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
  console.log("upload image is runing")
res.send(req.body.uploadimg)
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
  console.log("upload image is runing")
  var formData = new formidable.IncomingForm();
formData.parse(req,function(error,fields,files){
  var oldPath=files.file.path;
  var newPath="public/uploadedimages/"+files.file.name;
  console.log(newPath)
  fs.copyFile(oldPath, newPath, function(err){
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
    console.log("upload image is runing")
    var formData = new formidable.IncomingForm();
  formData.parse(req,function(error,fields,files){
    var oldPath=files.file.path;
    var newPath="public/askedquestion/"+files.file.name;
    console.log(newPath)
    fs.copyFile(oldPath, newPath, function(err){
       res.send("/"+ newPath)
    })
  })
  })


app.get("/getallcontent",function(req,res){

    res.render("getallcontent.ejs",{username:req.session.username})
})


app.get("/Getallcontents",function(req,res){

    res.render("Getmycontents.ejs",{username:req.session.username})
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

          

            app.get("/contactme",function(req,res){

                res.render("contactme.ejs")
            })


            app.get("/chat",function(req,res){

                res.render("room.ejs",{username:req.session.username})
            })

            app.get("/gchat",function(req,res){

                res.render("room.ejs",{username:req.session.username})
            })

            app.post("/enterchat",function(req,res){
                res.render('startchat.ejs',{username:req.body.username,roomid:req.body.roomid})   
            
            })




            const rooms={}

            const botName = 'ChatCord Bot';
            
            let room;
            io.on("connection",function(socket){
               socket.on('join-room',function(roomid,cb){
                socket.join(roomid)
                ///cb(`joined ${room}`)
                 room=roomid

                io.to(room).emit('new_message',`${cb} has joined`)
            })

            //------------------------------------------video chat-----------------------------------------
            socket.on("room",function(roomi){
                socket.join(roomi)
                })



                socket.on('user joined',function(data){
                  
                      rooms[data.room]=data.id
                    
                    console.log(rooms)
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
                      room: user.room });
                   })
                
                
                   socket.on("peerid",function(id,room){
                   
                  
                    io.to(room).emit("mypeerid",id,room)
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
                
                      // Send users and room info
                      io.to(user.room).emit('roomUsers', {
                        room: user.room,
                        users: getRoomUsers(user.room)
                      });
                    }
                  });



                  socket.on('yourstream',function(event,mroom,id){
                    console.log('this isssssssssssssssclick' +" "+event,mroom)
                      io.to(mroom).emit("allstream",event,id)
                    })
                    
                    
                    
                    
                          socket.on('chat', message => {
                           io.emit('chat',message)
                          })
                    
                    
                          
                          socket.on("refresh",()=>{
                            console.log("fgzagf")
                            
                            io.emit("pagerefresh");
                               
                               
                            })
                    
                            socket.on('screeningdata',function(data){
                                io.to(data.room).emit('screening',data.screenid)
                              })
                      
                            socket.on('mouse', (data) => socket.broadcast.emit('mouse', data))
                      
                           // socket.on('disconnect', () => console.log('Client has disconnected'))
                           
                            socket.on('answer', ({x,y, input}) => {
                              console.log(x,y)
                           io.emit('answer1',({x,y,input}))
                           })
                           io.emit('reload');       
                  
//------------------------------------------------------------------------------------------------------

                socket.on("message",function(roomid,username,chat,fileinfo){
console.log("file is emitted")
                    if(fileinfo!=""){
                        let buff = new Buffer.from(fileinfo);
                        let base64data = buff.toString('base64');
                    io.to(room).emit('newdata',username,chat,base64data)
                    }
                    else{

console.log("no file is emitted")
                        io.emit('newdata',username,chat,fileinfo)
                    }

                  

                   
                    
              
//------------------------------------video chat------------------------------------------------------------






   


   
    //socket.broadcast.to(roomId).emit('user-connected', id)

   // socket.on('disconnect', () => {
      //console.log("gggg")
     // socket.broadcast.to(roomId).emit('user-disconnected', id)

    


        // socket.on('shar',function(){
        //   console.log("this is the event")
        //   io.emit("changesize")
        // })
      
   
     
   
  })
  
})

//-------------------------------------------------------------------------------------------------------



            app.get("/entervideochat",function(req,res){
                
                res.render('Newchat.html');
                })
    
            app.post("/entervideochat",function(req,res){
         
                res.render('chat.html',{user:req.body.username,room:req.body.room});
                })
    




///-----------------------------------------------video-----------------------------------------------






  





  //---------------------------------------videoupload-------------------------------------------------
const PORT=process.env.PORT
  http.listen(PORT||8800, () => {
    console.log("listening")
})

// app.post("/findresult",(req,res)=>{

    


//     connection.query("select * from " + req.body.myquiz + "", function (err, userdata, fields) {
//         if (err) throw (err)
    
    
//         fs.readFile(`C:\\Users\\Dell\\OneDrive\\Desktop\\node js\\myquizapp\\Templates\\views\\myresults.hbs`, 'utf8', (err, data2) => {
//             if (err) {
//                 console.error(err)
//                // console.log("nofile")
    
//             }
//             else {
//                 otherdata = JSON.stringify(userdata)
    
//                 data3 = `${data2}
    
//               <script>
//               data=${otherdata}
    
//               Mydata = Object.assign({}, data);
//               let name="${req.body.name}"
//              `
    
    
//                 var oldPath = `C:\\Users\\Dell\\OneDrive\\Desktop\\node js\\myquizapp\\src\\images1\\${req.body.myquiz}.html`
//                 fs.writeFile(oldPath, data3, (error) => {
//                     if (error) {
//                         console.log(error)
//                     }
//                     else {
//                         console.log("data written successfully")
//                     }
    
//                 })
    
//                 ///--------------------------------------------------------------------------
    
//                 fs.readFile(`C:\\Users\\Dell\\OneDrive\\Desktop\\node js\\myquizapp\\Templates\\views\\anotherfile.hbs`, 'utf8', (err, data4) => {
//                     if (err) {
//                         console.error(err)
    
//                     }
//                     else {
    
//                         var oldPath = `C:\\Users\\Dell\\OneDrive\\Desktop\\node js\\myquizapp\\src\\images1\\${req.body.myquiz}.html`
//                         fs.appendFile(oldPath, data4, (error) => {
//                             if (error) {
//                                 console.log(error)
//                             }
//                             else {
//                                 console.log("data appended successfully")
                              
    
//                             }
    
//                             var oldPath = `C:\\Users\\Dell\\OneDrive\\Desktop\\node js\\myquizapp\\src\\images1\\${req.body.myquiz}.html`
//                             fs.readFile(`C:\\Users\\Dell\\OneDrive\\Desktop\\node js\\myquizapp\\src\\images1\\${req.body.myquiz}.html`, (err, data2) => {
//                                 if (err) {
                                   
//                             console.log(err)
//                                 }
//                                 else {
                                   
//                                     res.writeHead(200, { 'Content-Type': 'text/html' });
//                                     res.write(data2)
                                   
//                                 }
                            
//                                 res.end();
                                
                            
//                             })
    
    
    
//                         })
//                     }
    
//                 })
//               ///----------------------------------------------------------------------------
//             }
    
//         })
//     })
    
    
//     })


//-----------------------------------registration-----------------------------------------------------------
// app.post('/register',newmiddleware,newmiddleware1,(req, res) => {
//     let k=""
//     let content=""
//     if(!req.session.email){
//     payload={
//         username:req.body.name,
//         email:req.body.email,
//         uniquecode:req.body.uniquecode,
//         password:req.body.password,
//     }
//         const token=jwt.sign(payload,process.env.KEY_NEW,{expiresIn:'1hr'});
//         var mailOptions={
//             from:"rav39439@gmail.com",
//             to:req.body.email,
//             subject:"signup successful",
//             html:`<h2>${req.body.name}! Thanks for registering on our site</h2>
//             <h4>Please verify your mail to continue</h4>
//             <a href="https://neweducationworld.herokuapp.com/verify-email?token=${token}">verify your email</a>
//             `
//         }
//         transporter.sendMail(mailOptions,function(error,info){
        
//             if(error){
//                console.log(error)
//             }else{
//                 res.render("verify-email.ejs",{token:token})
//                 console.log("verificartion email is sent")
//                 console.log(req.body.email)
//             }
//        })
//     }
//     else{
//         console.log(req.session.email)
    
//         res.send("please logout to continue")
//     } 
//     })
    
    
    //app.get("/verify-email",function(req,res){
    // if(req.query.token){
    //     const decodedToken=jwt.verify(req.query.token,process.env.KEY_NEW)
    // username=decodedToken.username
    //     uniquecode=decodedToken.uniquecode
    //    password=decodedToken.password
    //     email=decodedToken.email
    
    //     bcrypt.genSalt(10, function(err, salt) {
    //         bcrypt.hash(password, salt, function(err, hash) {
    //     var c = "INSERT INTO `users` ( `Name`,`email`,`password`,`uniquecode`,`admin`,`isverified`,`token`) VALUES ('" +username+ "','" +email+ "','" + hash + "','" +uniquecode + "','true','true','"+req.query.token+"')";
    //     connection.query(c, (err, rows) => {
    //     if(err){
    //     console.log(err)
    //     }
    //     else{
    //         res.render("userinformation.ejs",{message:"You have successfully registered. Now you can proceed to login"})
    //     }
    
    // })
    // })
    // })
    // }
    // else{
    //     req.session.destroy()
    //     res.send("something wrong please contact")
    // }
    
    //})
    
    // app.post("/hiddencontent",function(req,res){



    //     var mydat="select * from uploadtab"
    //     connection.query(mydat,function(err,data){

    //         res.render("hiddencontent.ejs",{data:data,code:req.body.secretcode,uniquecode:req.body.uniquecode})
    //     })
    // })


    // app.get("/hiddencontent",function(req,res){
              
    //     if(req.session.isadmin=="true"){

    //         res.render("hiddencontent.ejs")
    //     }
    //     else{
    //         res.json({
    //             "message":"You are not admin. Kindly register as admin to access content"
    //         })
    //     }
    // })