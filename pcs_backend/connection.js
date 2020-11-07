const pgp = require('pg-promise')();

const cn = {
    host: 'pcsdb.cahkpsiixgsb.ap-southeast-1.rds.amazonaws.com',
    port: 5432,
    database: 'postgres',
    user: 'jamesmell',
    password: '12345678',
};

const DB = pgp(cn);

module.exports = {
    cn,
    DB
}
