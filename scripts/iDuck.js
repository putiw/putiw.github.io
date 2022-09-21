
import myJson from './conversation.json' assert {type: 'json'};

const ask = document.querySelector('.ask');
const ques = document.querySelector('.ques');

const guesses = document.querySelector('.guesses');


function checkGuess() {
    const userGuess = Text(guessField.value);

    guesses.textContent = `${userGuess} `;
    console.log(guesses.textContent)
    console.log(userGuess)
   //myJson.person[guesses.textContent]
    document.getElementById("box").innerText = userGuess;

  }

  ask.addEventListener('click', checkGuess);


