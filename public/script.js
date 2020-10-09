const socket = io('/');  //socket connection
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;
let peers = {};

var peer = new Peer(undefined,{   //we undefine this because peer server create it's own user it
  //path: '/peerjs',
	host: '/',
	port: '3001'
});

let myVideoStream;
navigator.mediaDevices.getUserMedia({     //by using this we can access user device media(audio, video) 
	video: true,
	audio: false
}).then(stream =>{                        //in this promice we sended media in stream
    addVideoStream(myVideo, stream);
    myVideoStream = stream;
    peer.on('call', call =>{               //here user system answer call and send there video stream to us
    	console.log("answered");        
    	call.answer(stream);               //via this send video stream to caller
    	const video = document.createElement('video');
    	call.on('stream', userVideoStream =>{
    		addVideoStream(video, userVideoStream);
    	})
    })

    socket.on('user-connected', (userId) =>{   //userconnected so we now ready to share 
	    console.log('user ID fetch connection: '+ userId); //video stream
      connectToNewUser(userId, stream);        //by this fuction which call user
    }); 
})

socket.on('user-disconnected', userId =>{   //userconnected so we now ready to share 
      if(peers[userId]) peers[userId].close();
      console.log('user ID fetch Disconnect: '+ userId); //video stream
              //by this fuction which call user
}); 

//if someone try to join room
peer.on('open', id =>{
 	socket.emit('join-room', ROOM_ID, id); //if someone join room send roomid and userid to server
})

const connectToNewUser = (userId, stream) =>{
	   console.log('User-connected :-'+userId);
     let call =  peer.call(userId, stream);       //we call new user and sended our video stream to him
     const video = document.createElement('video');
     call.on('stream', userVideoStream => {
          addVideoStream(video, userVideoStream);  // Show stream in some video/canvas element.
      })
      call.on('close', () =>{
      	video.remove()
      })

      peers[userId] = call;
}


 const addVideoStream = (video, stream) =>{      //this help to show and append or add video to user side
	video.srcObject = stream;
	video.addEventListener('loadedmetadata', () =>{
		video.play();
	})
	videoGrid.append(video);
}

//to Mute or Unmute Option method
const muteUnmute = () =>{
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setMuteButton();
  }else{
    setUnmuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
}

const setUnmuteButton = ()=>{
   const html = `<i class="fas fa-microphone"></i>
                <span>Mute</span>`;
   document.querySelector('.Mute__button').innerHTML = html;
   console.log("You are Unmuted");
}

const setMuteButton = () =>{
  const html = `<i class="fas fa-microphone-slash" style="color:red;"></i>
                <span>Unmute</span>`;
  document.querySelector('.Mute__button').innerHTML = html;
  console.log("Muted");
}

//Video ON or OFF
const videoOnOff = () =>{
  const enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    unsetVideoButton();
  }else{
    setVideoButton();
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
}

const setVideoButton = ()=>{
   const html = `<i class="fas fa-video"></i>
                <span>Stop Video</span>`;
   document.querySelector('.Video__button').innerHTML = html;
   console.log("Cammera Mode ON");
}

const unsetVideoButton = () =>{
  const html = `<i class="fas fa-video-slash" style="color:red;"></i>
                <span>Start Video</span>`;
  document.querySelector('.Video__button').innerHTML = html;
  console.log("Cammera Mode OFF");
}

//code for disconnect
const disconnectNow = ()=>{
    window.location = "http://localhost:3000/";
    
}