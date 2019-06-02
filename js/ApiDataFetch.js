var localData = [];

async function fetchData(apiCall = 'https://jsonplaceholder.typicode.com/users') {
    // const res = await fetch(apiCall);
    // const data = await res.json();

    // return data;
    fetch(apiCall)
        .then(res => res.json()) // It resolves the promise iwth a json object
        .then(res => {

            localData = res;
            console.log(localData[0]);
            return res;

        })
}