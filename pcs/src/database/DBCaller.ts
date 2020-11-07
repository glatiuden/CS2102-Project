const PROD_PATH = 'https://tranquil-fortress-32192.herokuapp.com/';
const TEST_PATH = 'http://localhost:5000/';

export async function callFunction(func_name, vals) {
    return fetch(`https://tranquil-fortress-32192.herokuapp.com/function/${func_name}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(vals)
    }).then(function (response) {
        return response.text();
    }).then(function (data) {
        return data;
    });
}

export async function callProcedure(proc_name, vals) {
    return fetch(`https://tranquil-fortress-32192.herokuapp.com/procedure/${proc_name}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(vals)
    }).then(function (response) {
        return response.text();
    }).then(function (data) {
        return data;
    });
}

export async function callQuery(command, table_name, columns, values) {
    return fetch(`https://tranquil-fortress-32192.herokuapp.com/query`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    }).then(function (response) {
        return response.text();
    }).then(function (data) {
        return data;
    });
}

