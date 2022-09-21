
import myJson from './conversation.json' assert {type: 'json'};

const ask = document.querySelector('.ask');
const ques = document.querySelector('.ques');

const guesses = document.querySelector('.guesses');


function checkGuess() {

   
    document.getElementById("box").innerText = guessField.value;
console.log(myJson.person[guessField.value])
  }

  ask.addEventListener('click', checkGuess);


