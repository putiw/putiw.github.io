
import myJson from './conversation.json' assert {type: 'json'};

const ask = document.querySelector('.ask');
const ques = document.querySelector('.ques');

const guesses = document.querySelector('.guesses');

var input = document.getElementById("guessField");

function checkGuess() {

    guessField.value;

    document.getElementById("box").innerText = myJson.person[guessField.value];

  }

input.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("ask").click();
  }
});

ask.addEventListener('click', checkGuess);

