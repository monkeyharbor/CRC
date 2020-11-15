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
    console.log('listening at ', port);
});

//init socket.io
let io = require('socket.io')();
io.listen(server);

//user connection
io.sockets.on('connection', function (socket) {
    console.log("We have a new client: " + socket.id);

    let bot = new RiveScript();

    // const brains = [
    //     'rsBrain/begin.rive',
    //     'rsBrain/bot.rive'
    // ];

    bot.loadDirectory("rsBrain").then(loading_done).catch(loading_error);

    function loading_done() {
        console.log("rockbot finished loading!");
    }

    function loading_error(error, filename, lineno) {
        console.log("Error when loading files: " + error);
    }

    //Listen for 'msg' from client
    socket.on('msg', function (data) {
        console.log("Server recd 'msg' event: " + data.msg);

        bot.sortReplies();

        // let userMsg = data.msg;
        // console.log(data.msg);

        bot.reply("local-user", data.msg).then(function (reply) {
            console.log("The Reply Message is: " + reply);

            let replyObj = { "reply": reply };
            socket.emit('chat message', replyObj);

            //?? NOT WORKING CORRECTLY
            // db.insert(data.msg, replyObj,(err, newDocs)=>{
            //     if(err) {
            //         res.json({task: "task failed"});
            //     } else {
            //         res.json({task:"success"});
            //     }
            // });
        });

    });

    //insert client and server data into db
    // db.insert([{ a: 5 }, { a: 42 }], function (err, newDocs) {
    //     // Two documents were inserted in the database
    //     // newDocs is an array with these documents, augmented with their _id
    //   });

    // db.insert(obj,(err, newDocs)=>{
    //     if(err) {
    //         res.json({task: "task failed"});
    //     } else {
    //         res.json({task:"success"});
    //     }
    // })

    //Listen for client disconnect
    socket.on('disconnect', function () {
        console.log("A client has disconnected: " + socket.id);
    });
})