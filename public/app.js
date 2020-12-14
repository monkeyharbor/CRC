
window.addEventListener('load', function () {
  //Open and connect socket
  let socket = io();
  //Listen and confirm connection
  socket.on('connect', function () {
    console.log("socket connected");
  });

  let chatBox = document.getElementById('chat-box-msgs');
  let msgInput = document.getElementById('msg-input');
  let sendButton = document.getElementById('send-button');

  //listen for click after user input
  sendButton.addEventListener('click', function () {

    //??? add alternative if user clicks enter/return

    let curMsg = msgInput.value;
    // let msgObj = { "name": 'curName', "msg": curMsg };
    let msgObj = { "msg": curMsg };

    //changed p to span to allow background color
    let userEl = document.createElement('p');

    // userEl.innerHTML = " You: " + curMsg;
    userEl.innerHTML = curMsg;

    //add color behind text
    // userEl.style.backgroundColor = 'white';

    //Add to page
    chatBox.appendChild(userEl);
    //Add auto scroll for the chat box 
    chatBox.scrollTop = chatBox.scrollHeight;

    //clear field after user inout
    msgInput.value = "";

    //Send the message object to the server
    socket.emit('msg', msgObj);
  });

  // replybot received
  socket.on('chat message', function (data) {

    let botMsg = data.reply;

    //add delay befor BOT replies
    setTimeout(function () {

      //insert replyEl (botMsg) into chatBox
      let replyEl = document.createElement('span');
      replyEl.innerHTML = botMsg;
      replyEl.style.backgroundColor = 'rgb(232, 229, 229)';
      //Add to page
      chatBox.appendChild(replyEl);
      //Add auto scroll for the chat box 
      chatBox.scrollTop = chatBox.scrollHeight;
    }, 800);
  })
})

// -------------p5 background below----------------

let img;
// let song;
y = 0;
x = 0;

function preload() {
  song = loadSound('assets/audio_rock.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  img = loadImage("assets/v2.png");
  song.loop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(230, 230, 230);

  // scale proportionally
  imageMode(CORNER);
  image(img, 0, 0, width, img.height * width / img.width); // to fit width

  stroke("gray");
  strokeWeight(2);
  line(x, 0, x, height);

  x++;
  if (x > width) {
    x = 0;
  }

}

function mousePressed() {
  if (song.isPlaying()) {
    // .isPlaying() returns a boolean
    song.pause(); // .play() will resume from .pause() position

  } else {
    song.play();
  }
}
