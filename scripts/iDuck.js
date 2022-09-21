
import myJson from './conversation.json' assert {type: 'json'};

const ask = document.querySelector('.ask');
const ques = document.querySelector('.ques');

const guesses = document.querySelector('.guesses');


function checkGuess() {

   //myJson.person[guesses.textContent]
    document.getElementById("box").innerText = 'kk';
console.log(guessField.value)
  }

  ask.addEventListener('click', checkGuess);


