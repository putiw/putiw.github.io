
import myJson from './conversation.json' assert {type: 'json'};

const ask = document.querySelector('.ask');
const ques = document.querySelector('.ques');

const guesses = document.querySelector('.guesses');


function checkGuess() {

    guessField.value;

    document.getElementById("box").innerText = myJson.person[guessField.value];

  }

  ask.addEventListener('click', checkGuess);


