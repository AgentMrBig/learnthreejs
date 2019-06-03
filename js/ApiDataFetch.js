var localData = [];

const alphaAvantageAPIKey = 'GV0M940C3SCKSOPH';
var firstSymbol = 'EUR';
var secondSymbol = 'USD';

var fullApiString = `https://www.alphavantage.co/query?function=FX_INTRADAY&from_symbol=${firstSymbol}&to_symbol=${secondSymbol}&interval=5min&outputsize=full&apikey=${alphaAvantageAPIKey}`

var fullApiString = fullApiString.toString();

function getData() {
    fetch(fullApiString)
        .then(function(res) {
            return res.json();

        })
        .then(function(data) {
            console.log(data);
        })

}

// console.log(fullApiString);
// async function fetchData(fullApiString) {
//     // const res = await fetch(apiCall);
//     // const data = await res.json();

//     loadJSON(fullApiString);
//     // return data;
//     fetch(fullApiString)
//         // .then(res => res.json()) // It resolves the promise iwth a json object
//         .then(res => {

//             localData = res;
//             console.log(res);
//             return res;

//         })
//         .catch(function(e) {
//             console.log(e)
//         })
// }