
import myJson from './conversation.json' assert {type: 'json'};

const ask = document.querySelector('.ask');
const ques = document.querySelector('.ques');

const guesses = document.querySelector('.guesses');


function checkGuess() {
    const userGuess = Text(guessField.value);

    guesses.textContent = `${userGuess} `;
   
    document.getElementById("box").innerText = myJson.person[guesses.textContent];

  }

  ask.addEventListener('click', checkGuess);


