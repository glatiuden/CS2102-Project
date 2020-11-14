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

export async function callNotification(po_email) {
    return fetch(`https://tranquil-fortress-32192.herokuapp.com/notification/${po_email}`, {
        method: 'GET'
    }).then(function (response) {
        return response.text();
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

export function errorFormatter(result) {
    return result.substring(result.indexOf('error') + 7, result.length);
}

export function crudResultFormatter(result, funcName) {
    try {
        result = JSON.parse(result);
        return result.length > 0 ? result[0][funcName] : null;  
    } catch (e) {
        return result;
    }
    // if(JSON.)
    // if(result.includes('error')) {
    //   return errorFormatter(result);
    // } else {
    //   result = JSON.parse(result);
    //   return result.length > 0 ? result[0][funcName] : null;  
    // }
}

