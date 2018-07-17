var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "12345678",
    database: "hello"
});

con.connect(function(err) {
    if (err) {
        console.log(err);
        throw err;
    }
    console.log("Connected!");
    sql = "SELECT * FROM main";
    con.query(sql, function (err, result, fields) {
        if (err) {
            console.log(err);
            throw err;
        }
        console.log(result[0]['data_value']);
        process.exit();
    });
})