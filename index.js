//init express 
let express = require('express');
let app = express();
app.use('/', express.static('public'));

let RiveScript = require('rivescript');

//DB initial
let Datastore = require('nedb')
let db = new Datastore('rock.db');
db.loadDatabase();

//init HTTP server
let http = require('http');
let server = http.createServer(app);
let port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log('Big Ear listens via ', port);
});

//init socket.io
let io = require('socket.io')();
io.listen(server);

//user connection
io.sockets.on('connection', function (socket) {
    console.log("We have a new client: " + socket.id);

    let bot = new RiveScript();

    bot.loadDirectory("rsBrain").then(loading_done).catch(loading_error);

    function loading_done() {
        console.log("rockbot finished loading!");
    }

    function loading_error(error, filename, lineno) {
        console.log("Error when loading files: " + error);
    }

    //Listen for 'msg' from client
    socket.on('msg', function (data) {
        console.log("Server recd 'msg' event: " + data.msg)

        bot.sortReplies();

        let userMsg = data.msg;

        bot.reply("local-user", data.msg).then(function (reply) {
            console.log("The Reply Message is: " + reply);

            let replyObj = { "reply": reply };
            socket.emit('chat message', replyObj);

           // ???
            let dbInsert = {
                userMsg, 
                reply: "reply"
            };
            //result... ??? 
            //{"userMsg":"hello","reply":"reply","_id":"HZjymKL50hKyxxxr"}

            //cant do res because not using app.get req/res
            db.insert(dbInsert,(err, newDocs)=>{
                if(err) {
                    console.log('failed');
                } else {
                    console.log('success');
                }
            });
        });

    });

    //Listen for client disconnect
    socket.on('disconnect', function () {
        console.log("A client has disconnected: " + socket.id);
    });
})