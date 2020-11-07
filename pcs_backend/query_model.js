const { DB } = require('./connection');

const callFunction = async (func_name, attrs) => {
    const result = await DB.func(func_name, attrs);
    return result;
}

const callProcedure = async (proc_name, attrs) => {
    const result = await DB.proc(proc_name, attrs);
    return result;
}

const callQuery = async (command, table_name, columns, values) => {
    let result = "";

    switch (command) {
        case 'SELECT':
            result = await DB.query('SELECT ${columns:name} FROM ${table:name}', {
                columns: columns.length === 0 ? '*' : columns,
                table: table_name
            });
            break;
    }
    return result;
}

module.exports = {
    callFunction,
    callProcedure,
    callQuery
}