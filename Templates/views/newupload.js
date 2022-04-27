import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage,ref as sRef } from "firebase/storage";
import { getFirestore,doc,getDoc,setDoc,collection,addDoc} from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyAZ9x_QbhCfY9aEsqxEiYhWtfIRNGl_qeo",
    authDomain: "mynewproject-ae49a.firebaseapp.com",
    projectId: "mynewproject-ae49a",
    storageBucket: "mynewproject-ae49a.appspot.com",
    messagingSenderId: "939005557600",
    appId: "1:939005557600:web:ee766070db4bd2dadfbc05",
    measurementId: "G-YFKTT151SN"
  };

  const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

var files=[]
var reader=new Filereader();
var namebox=document.getElementById('namebox')
var extlab=document.getElementById('extlab')
var myimg=document.getElementById('myimg')
var proglab=document.getElementById('upprogress')
var SelBtn=document.getElementById('selbtn')
var Upbtn=document.getElementById('upbtn')
var Downbtn=document.getElementById('downbtn')
var input=document.createElement('input')

input.type="file";
input.onchange=(e)=>{
  files=e.target.files
  var extension=GetFileName(files[0])
  namebox.value=name;
  extlab.innerHTML=extension;
  reader.readAsDataURL(files[0])

}
reader.onload=function(){
  myimg.src=reader.result
}
function GetFileExt(file){
  var temp=file.name.split('.')
  var ext=temp.slice(temp.length-1,temp.length);
  return '.'+ext[0];

}
function GetFileName(file){
  var temp=file.name.split('.')
  var fname=temp.slice(0,-1).join('.')
  return fname;
}

async function UploadProcess(){
  var ImgToUpload=files[0]
  var ImgName=namebox.value+extlab.innerHTML;
  const metaData={
    contentType:ImgUpload.type
  }

  const storage=getStorage();
  const stroageRef=sRef(storage,"Images/"+ImgName);
  const Uploadtask=uploadBytesResumable(storageRef,ImgToUpload,metaData)
  Uploadtask.on('state-changed',(snapshot)=>{
    var progress=(snapshot.bytesTransferred/snapshot.totalBytes)*100;
    proglab.innerHTML="Upload" + progress + "%";

  },(error)=>{
    alert("error: Image not successfully uploaded")
  },()=>{
    getDownloadURL(uploadtask,snapshot,ref).then((downloadURL)=>{
console.log(downloadURL)
    })
  })



}
async function SaveURLtoFirestore(){
  var name=namebox.value;
  var ext=extlab.innerHTML;
  var ref=doc(clouddb,"ImageLinks/"+name);
  await setDoc(ref,{
    ImageName:(name+ext),
    ImageURL:url
  })
}
async function GetImagefromFirestore(){
  var name=namebox.value
  var ref=doc(clouddb,"ImageLinks/"+name);
  const docSnap=await getDoc(ref);
  if(docSnap.exists()){
    myimg.src=docSnap.data.ImageURL;
  }
}
Upbtn.onclick=UploadProcess;
Downbtn.onclick=GetImagefromFirestore;
