import myJson from './example.json' assert {type: 'json'};

myJson.forEach(function (el, i, arr) {
    lookup[el.question] = el.answer;
});

console.log(lookup['Who are you']); 