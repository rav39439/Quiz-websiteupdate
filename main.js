

//--------------------------------------------videocall-------------------------------------------------

const socket = io('http://localhost:8700')
    
window.addEventListener('load', (event) => {
  var peer = new Peer()
  var myStream;
  var currentPeer;
  var peerlist = []
  peer.on('open', function (id) {

    //socket.emit('join-room', ROOM_ID, id)
    document.getElementById('show-peer').innerHTML =id
  })
 // module.exports={id}
  peer.on('call', function (call) {
    //const start=async()=>{
    
  
   navigator.mediaDevices.getUserMedia(
      { video:true, audio: true})
      .then((stream) => {
       myStream = stream
      addourvideo(stream) //(myvideo on my side)
        call.answer(stream)
        call.on('stream', function (remotestream) {
          if(!peerlist.includes(call.peer)){
          // addremotevideo(remotestream)///(users video on my side)
            currentPeer=call.peerConnection
peerlist.push(call.peer)
          }

        



         // socket.on('user-connected', id => {
           // console.log(id)
           ///connectToNewUser(id, stream)
          //})

       })





      }).catch((err) => {
        console.log(err + "unable to get media")
      })
  })


 


  //socket.on('user-disconnected', id => {
    //console.log(id)
//if (peerlist[id]) peerlist[id].close()
//})
  document.getElementById("call-peer").addEventListener('click', (e) => {
    let remotePeerId = document.getElementById("peerID").value;
    document.getElementById('show-peer').innerHTML = "connecting" + remotePeerId;
    callPeer(remotePeerId)
  })
  document.getElementById("refresh").addEventListener('click', (e) => {
    let remotePeerId = document.getElementById("peerID").value;
    socket.on('reload', function (remotePeerId) {
      location.reload();
  });
  })
 
  document.getElementById("sharescreen").addEventListener('click', (e) => {
   navigator.mediaDevices.getDisplayMedia({video:{
     cursor:"always"
   },
   audio:{
     echoCancellation:true,
     noiseSupression:true
   }
   }).then((stream)=>{
let videoTrack=stream.getVideoTracks()[0];//getting the first videotrack of the screen
videoTrack.onnded=function(){
stopscreenshare()//stopping the screen share
}
let sender=currentPeer.getSenders().find(function(s){
return s.track.kind==videoTrack.kind
})//returns the first sender from the array currentpeer.getsenders .

sender.replaceTrack(videoTrack)//replaces the video track of the first sender with the screen track('videotrack')
   }).catch((err)=>{
console.log("unable to get media "+err)
   })

  })

  function callPeer(id) {
    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    }).then((stream) => {
      myStream = stream
      //addourvideo(stream)//(user video on users side)
      let call = peer.call(id, stream)
      call.on('stream', function (remotestream) {

        if(!peerlist.includes(call.peer)){
          addourvideo(remotestream)  //(myvideo on users side)
          currentPeer=call.peerConnection
          peerlist.push(call.peer)
        }
       

      })
      //call.on('close',()=>{
//video.remove()
     // })
      
    }).catch((err) => {
      console.log(err + "unabel to get media")

    })

  }


  function stopscreenshare(){
    let videoTrack=myStream.getVideoTracks()[0]
    var sender=currentPeer.getSenders().find(function(s){
      return s.track.kind=videoTrack.kind
      sender.replaceTrack(videoTrack)
    })
    
  }
  function addremotevideo(stream) {
    let video = document.createElement("video")
    video.classList.add("video")
    video.srcObject = stream
    video.play()
    document.getElementById('remotevideo').append(video)
  }
  function addourvideo(stream) {
    let video = document.createElement("video")
    video.classList.add("video")
    video.srcObject = stream
    video.play()
    document.getElementById('ourvideo').append(video)
  }
})


//------------------------------------------chat portion-------------------------------------------------





const chat = document.querySelector('.chat-form')
const Input = document.querySelector('.chat-input')
const roomName = document.getElementById('room-name');

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.emit('joinRoom', { username, room });




socket.on('roomUsers', ({ room}) => {
  outputRoomName(room);
 // outputUsers(users);
});

socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  //chatMessages.scrollTop = chatMessages.scrollHeight;
});




chat.addEventListener('submit', event => {
event.preventDefault()
let msg = event.target.elements.msg.value;

msg = msg.trim();

if (!msg) {
  return false;
}

socket.emit('chatMessage', msg);

  // Clear input
  event.target.elements.msg.value = '';
  event.target.elements.msg.focus();
});

///socket.emit('chat', Input.value)
//Input.value = ''




const chatWindow = document.querySelector('.chat-window')

const renderMessage = message => {
const div = document.createElement('div')
div.classList.add('render-message')
div.innerText = message
chatWindow.appendChild(div)
}

function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

function outputRoomName(room) {
  roomName.innerText = room;
}
//socket.on('chat', message => {
// make sure to modify this
//renderMessage(message)
//})





function disableF5(e) { if (e.keyCode == 116) e.preventDefault(); };


//-------------------------------drawing tool------------------------------------------------------------
if(username!="rav"){
  disableF5()

}
//


let color = '#FFF'
let strokeWidth = 4

function setup() {
	// Creating canvas
	const cv = createCanvas(1200, 600)
	cv.position(600, 40)
	cv.background(200)


  $('#mybutton').click(function(e) {
    //alert("reagre")
    socket.emit("refresh")
    
    
    
    })






  socket.on("pagerefresh",()=>{

    //alert("asdfsfadf")
    location.reload()   
})






  socket.on("answer1",({ x, y,input }) => {

    
    let myPTag = createDiv(input);
  myPTag.position(x, y);
  myPTag.size(500,100)
  myPTag.style('color', '#ff0000');
  myPTag.style('font-size','18px')
  })


  const chat2 = document.querySelector('.myform')
const myinput = document.getElementById('mytext')
const xposition=document.getElementById("xposition")
const yposition=document.getElementById("yposition")
  chat2.addEventListener('submit', event => {
 event.preventDefault()
 console.log(xposition,yposition,myinput.value)
 socket.emit('answer', {x:xposition.value,y:yposition.value,input:myinput.value})
 myinput.value = ''
//togglebtn=createButton("Toggle erase")
//togglebtn.position(30,60)
//togglebtn.mouseClicked(toggleErase)

  })

  


  let data1 = localStorage.getItem("mydata");
  data2=JSON.parse(data1)

  if(!Array.isArray(data2))
  {
    console.log("no value")
  }
  else{
 for(let i=0;i<data2.length;i++){
    line(data2[i].x,data2[i].y,data2[i].px,data2[i].py)
 }

  }
	// Callback function
	socket.on('mouse', data => {
		stroke(data.color)
		strokeWeight(data.strokeWidth)
		line(data.x, data.y, data.px, data.py)
	})
  
	// Getting our buttons and the holder through the p5.js dom
	const color_picker = select('#pickcolor')
	const color_btn = select('#color-btn')
	const color_holder = select('#color-holder')

	const stroke_width_picker = select('#stroke-width-picker')
	const stroke_btn = select('#stroke-btn')

	// Adding a mousePressed listener to the button
	color_btn.mousePressed(() => {
		// Checking if the input is a valid hex color
		if (/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color_picker.value())) {
			color = color_picker.value()
			color_holder.style('background-color', color)
		}
		else {console.log('Enter a valid hex value')}
	})

	// Adding a mousePressed listener to the button
	stroke_btn.mousePressed(() => {
		const width = parseInt(stroke_width_picker.value())
		if (width > 0) strokeWidth = width
	})
}

//function toggleErase(){

  //if(eraseEnable){
  //  noErase();
    //eraseEnable=false;
 // }
 // else{
   // erase()
  //  eraseEnable=true;
 // }
//}


function mouseDragged() {
	// Draw
	stroke(color)
	strokeWeight(strokeWidth)
	line(mouseX, mouseY, pmouseX, pmouseY)

	// Send the mouse coordinates
	sendmouse(mouseX, mouseY, pmouseX, pmouseY)
}


// Sending data to the socket
function sendmouse(x, y, pX, pY) {
	const data = {
		x: x,
		y: y,
		px: pX,
		py: pY,
		color: color,
		strokeWidth: strokeWidth,
	}

 let objdata
  let data1 = localStorage.getItem("mydata");
    if (data1 == null) {
      objdata = [];
    } else {
     objdata = JSON.parse(data1);
   }
 objdata.push(data)
  localStorage.setItem("mydata",JSON.stringify(objdata))

//console.log(data2.length)

//console.log(JSON.parse(data1))
//console.log(data)
//for(let i=0;i<data1.length;i++){
 // console.log(data1[i])


//}
	socket.emit('mouse', data)

}

let clearm=document.getElementById('dd')
clearm.addEventListener('click',function(){
  localStorage.clear()
})



//function draw(){
 

  
//}

//-------------------------------------ourscreeen-----------------------------------------------------

//  remotePeerId = document.getElementById("peerID").value;
//         document.getElementById('show-peer').innerHTML = "connecting" + remotePeerId;
 
//  callScreen(remotePeerid)

//           function callScreen(id) {
//         navigator.mediaDevices.getDisplayMedia({
//           video: {MediaSource:"screen"},
//           audio: true
//         }).then((stream) => {
//           myStream = stream
//           addscreenvideo(stream)
//           let call = peer.call(id, stream)
//           call.on('stream', function (remotestream) {
//             addremotevideo(remotestream)
//         })
//         })
//       }
 
//       function addscreenvideo(stream) {
//         let video = document.createElement("video")
//         video.classList.add("video")
//         video.srcObject = stream
//         video.play()
//         document.getElementById('windowshare').append(video)
//       }