import myJson from './conversation.json' assert {type: 'json'};

function phoneticLookup(val) {

    let result = myJson[val];
    return result;
}
phoneticLookup("bb");