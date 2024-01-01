var chat = localStorage.getItem("userData");
chat = JSON.parse(chat);
chat = chat.chatbot;


function loadChat() {
  var chat = localStorage.getItem("userData");
  chat = JSON.parse(chat);
  chat = chat.chatbot;
  document.getElementById("body").innerHTML=""
let start = document.createElement("p");
start.classList.add("start");
start.innerText = "This is the start of your conversation";
document.getElementById("body").appendChild(start);


body = document.getElementById("body")

for (i = 0; i < chat.length; i++) {
  if (chat[i].role != "system") {
  let msg = document.createElement("div");
  msg.classList.add("msg");
  if (chat[i].role == "user") {
    msg.classList.add("user")
  }
  if (chat[i].role == "assistant") {
    msg.classList.add("bot")
  }

  msg.innerText = chat[i].content;
  document.getElementById("body").appendChild(msg);
    var element = msg;
    element.scrollTop = element.scrollHeight;;
  }

}
}

loadChat();

document.getElementById("sendbtn").addEventListener("click", async function(event) {
  await send(event);
}, false);

async function send(event) {
  event.preventDefault();
  msg = document.getElementById("msgTB").value;
  chat.push({
    "role": "user",
    "content": msg
  }); 

  data = localStorage.getItem("userData");
  data = JSON.parse(data);
  let newData = data;
  newData.chatbot = chat;
  /*{"uid":"idat7fFzoBbn2txraFwSAagfaeu1","email":"testing1@gmail.com","name":"testing1","groups":["Depression","OCD","Bipolar Disorder","Borderline Personality Disorder"],"therapists":[],"chatbot":[{"role":"user","content":"test"}]}*/
  newData.therapists = null;
  newData.chatbot = JSON.stringify(newData.chatbot).replace("[", "arrS").replace("]", "arrD").replace("{", "dictS").replace("}", "dictD")
  newData.groups = JSON.stringify(newData.groups)
  let toSend = Object.keys(newData).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(newData[key])).join('&')
  let a = await fetch("https://fakespotlessexperiment.randomcodingboy.repl.co/sendChat", {
    "headers": {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "accept-language": "en-US,en;q=0.9",
      "cache-control": "max-age=0",
      "content-type": "application/x-www-form-urlencoded",
      "sec-ch-ua": "\"Chromium\";v=\"118\", \"Google Chrome\";v=\"118\", \"Not=A?Brand\";v=\"99\"",
      "sec-ch-ua-mobile": "?1",
      "sec-ch-ua-platform": "\"Android\"",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "same-origin",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1"
    },
    "referrer": "https://fakespotlessexperiment.randomcodingboy.repl.co/signup",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": toSend,
    "method": "POST",
    "mode": "cors",
    "credentials": "omit"
  });
  let ab = await a.json();
  localStorage.setItem("userData", JSON.stringify(ab));
  loadChat();

}