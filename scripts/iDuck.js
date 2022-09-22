
import myJson from './conversation.json' assert {type: 'json'};

const ask = document.querySelector('.ask');
const ques = document.querySelector('.ques');

const guesses = document.querySelector('.guesses');

var input = document.getElementById("guessField");


function duckThinks1 () {
    document.getElementById("duckSays").innerText = ".";
}
function duckThinks2() {
    document.getElementById("duckSays").innerText = "..";
}
function duckThinks3(){
    document.getElementById("duckSays").innerText = "...";
}



function duckSaid() {

    if (guessField.value === undefined) {
        document.getElementById("duckSays").innerText = "Quack, quack..";
    } else {
        document.getElementById("duckSays").innerText = myJson.person[guessField.value];
    }

}


input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        
        document.getElementById("ask").click();
    }
});
guessField.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        
        document.getElementById("ask").click();
    }
});

ask.addEventListener('submit', duckSaid);

ask.addEventListener('click', function () {
    setTimeout(duckThinks1,200);
});
ask.addEventListener('click', function () {
    setTimeout(duckThinks2,400);
});
ask.addEventListener('click', function () {
    setTimeout(duckThinks3,600);
});
ask.addEventListener('click', function () {
    setTimeout(duckSaid, 900);
});

