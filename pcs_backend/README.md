This project contains files that serves as a backend server to RDS PostgreSQL database via
- ExpressJS
- PG Promise

Hosted on https://pcsbackend.azurewebsites.net/
Any updates to master branch will be automatically deployed.

## Available Methods

You can call the following methods

### `callFunction(func_name, attrs)`

Do a POST Request to [https://tranquil-fortress-32192.herokuapp.com/function/{func_name}](https://tranquil-fortress-32192.herokuapp.com/function/{func_name}). Pass your attributes and values as an object via Body if required. <br/>
Make sure you are only using this method & URL to call functions and not procedures.
On success: return SETOF data, else it will return false.

### `callProcedure(proc_name, attrs)`

Do a POST Request to [https://tranquil-fortress-32192.herokuapp.com/procedure/{proc_name}](https://tranquil-fortress-32192.herokuapp.com/procedure/{proc_name}). Pass your attributes and values as an object via Body if required. <br/>
Make sure you are only using this method & URL to call procedures and not functions.
Nothing is returned.

### `callQuery(command, table_name, columns, values)`

Do a POST Request to [https://tranquil-fortress-32192.herokuapp.com/{query}](https://tranquil-fortress-32192.herokuapp.com/procedure/{query})<br/>
Pass {
    command: "SELECT",
    table_name: "table_name",
    columns: "[]"
} as Body if required
<br/>
This methods allow you to directly inject SQL statements.<br/>
Due to laziness, it only supports SELECT at the moment.<br/>
However, you are advised to call your statement via Stored Procedures or Functions!
