const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { v4: uuidV4 } = require('uuid');
const cookieparser=require("cookie-parser");
const session=require("express-session");
app.use(cookieparser());
app.use(session({secret:"notyet",saveUninitialized:"false",resave:"true"}));
// const ExpressPeerServer = require('peer').ExpressPeerServer;
// const peerServer = ExpressPeerServer(server, {
//   debug: true
// });

// // server.listen(3000, () =>{
// // 	console.log("Serving port 3000");
// // });

// app.use('/peerjs', peerServer); //peerjs server living in express and runing at different ports

app.set('view engine', 'ejs');
app.use(express.static('public'));


app.get('/', (req, res) =>{
	req.session.host=true;
	//console.log(req.session.host);
	res.redirect(`/${uuidV4()}`);  //send uuid to client address bar
 })

app.get('/:room', (req, res) =>{
	let addRoomId = req.params.room;
	//req.session.host=false;
	var superUser ;
	if(req.session.host)superUser=true;
	else superUser=false ;
	console.log(superUser);
	  //console.log(addRoomId);
    //console.log(addRoomId);
	res.render('room',{roomId: `${addRoomId}` ,superuser: superUser}); //get id from address bar and send to ejs
})

io.on('connection', socket =>{
	//code to disconnect user using socket simple method ('join-room')
	socket.on('join-room',(roomId, userId) =>{
		//console.log("room Id:- " + roomId,"userId:- "+ userId);    //userId mean new user
		socket.join(roomId);                                       //join this new user to room
		socket.to(roomId).broadcast.emit('user-connected',userId); //for that we use this and emit to cliet

	    //code to disconnect user using socket simple method ('disconnect')
	    socket.on('disconnect', () =>{
	    	socket.to(roomId).broadcast.emit('user-disconnected', userId)
	    })
	})
})

server.listen(3000, () =>{
	console.log("Serving port 3000")
});
