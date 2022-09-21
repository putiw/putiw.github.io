
import myJson from './conversation.json' assert {type: 'json'};


document.getElementById("box").innerText = myJson.person["qq"];
