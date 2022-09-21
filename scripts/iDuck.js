
import myJson from './conversation.json' assert {type: 'json'};

// 👇️ {
//   name: 'Alice',
//   country: 'Austria',
//   tasks: [ 'develop', 'design', 'test' ],
//   age: 30
// }
console.log(myJson.person);

console.log(myJson.person.name); // 👉️ "Alice"
console.log(myJson.person.country); // 👉️ "Austria"