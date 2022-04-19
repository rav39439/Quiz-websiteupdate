const mysql=require('mysql2');
const express=require('express');
const bodyparser = require('body-parser');
const { DATABASE } = process.env;
const { PASSWORD } = process.env;
const { KEYHOST } = process.env;
const { KEYUSER } = process.env;
const { KEYPORT } = process.env;

const app=express();

var connection=mysql.createConnection({
    host:KEYHOST,
    user:KEYUSER,
    password:PASSWORD,
    database:DATABASE,
    port:KEYPORT

})
connection.connect((err)=>{
    if(err){
        console.log(err)
    }
    else{
        console.log('connected')
    }
})

// connection.query('select * from tabletest1', (err,results,fields)=>{
//     if(err){
//         return console.log(err)

//     }
//     return console.log(results)
// })
module.exports=connection