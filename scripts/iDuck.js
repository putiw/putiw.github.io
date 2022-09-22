
import myJson from './conversation.json' assert {type: 'json'};

const ask = document.querySelector('.ask');
const ques = document.querySelector('.ques');

const guesses = document.querySelector('.guesses');

var input = document.getElementById("guessField");

function duckSaid() {

    if (guessField.value === undefined) {
        document.getElementById("duckSays").innerText = "Quack, quack..";
     } else {
        document.getElementById("duckSays").innerText = myJson.person[guessField.value];
    }

}

input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("ask").click();
    }
});

ask.addEventListener('submit', duckSaid);

ask.addEventListener('click',  function(){
    setTimeout(duckSaid, 3000);
});