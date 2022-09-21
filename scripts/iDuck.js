import myJson from './conversation.json' assert {type: 'json'};

myJson.forEach(function (el, i, arr) {
    lookup[el.question] = el.answer;
});

console.log(lookup['Who are you']); 