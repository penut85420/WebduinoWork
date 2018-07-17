var webduino = require('webduino-js');
var mysql = require('mysql');
require('webduino-blockly');

// 建立 MySQL 的連接資訊
// 此處使用的範例為位於 localhost 的 hello 資料庫
// 登入 user 為 custom ，登入密碼為 12345678 ，此資訊需於 MySQL 控制台內設定
var con = mysql.createConnection({
    host: "localhost",
    user: "custom",
    password: "12345678",
    database: "hello"
});

// 開始連接至 MySQL 資料庫
con.connect(function(err) {
    if (err) {
        console.log(err);
        throw err;
    }
    console.log("Connected!");
})

// 宣告並初始化 Webduino
var board = new webduino.WebArduino('EKgV');

// 當板子狀態就緒後開始執行
board.on('ready', function () {
    board.samplingInterval = 250;

    // 宣告 RFID 感應器來自於 board
    // 腳位設定：SDA 10, SCK 13, MOSI 11, MISO 12
    var rfid = getRFID(board);

    // RFID 感應器開始偵測訊號
    rfid.read();

    // 當 RFID 偵測到訊號開始執行以下程式碼
    rfid.on('enter', function (_uid) {
        // _uid 為偵測到的識別碼
        console.log(_uid);

        // 組合時間字串
        dd = get_date("ymd") + ' ' + get_time("hms");

        // 組合 SQL 指令，將 UID 與時間戳記插入資料庫表格
        sql = `insert into test (id, data_value) values ('${_uid}', '${dd}');`

        // 送出 SQL 指令至 Database
        con.query(sql, function (err, result, fields) {
            if (err) {
                console.log(err);
                throw err;
            }

            // 組合 SQL 指令，選擇資料庫表格內的所有資料
            sql = "SELECT * FROM test";
            con.query(sql, function (err, result, fields) {
                if (err) throw err;
                // 將所有資料印出來
                console.log(result);
            });
        });
    });
});

// 取得日期的函式
function get_date(t) {
    var varDay = new Date(),
        varYear = varDay.getFullYear(),
        varMonth = varDay.getMonth() + 1,
        varDate = varDay.getDate();
    var varNow;
    if (t == "ymd") {
        varNow = varYear + "-" + varMonth + "-" + varDate;
    } else if (t == "mdy") {
        varNow = varMonth + "-" + varDate + "-" + varYear;
    } else if (t == "dmy") {
        varNow = varDate + "-" + varMonth + "-" + varYear;
    } else if (t == "y") {
        varNow = varYear;
    } else if (t == "m") {
        varNow = varMonth;
    } else if (t == "d") {
        varNow = varDate;
    }
    return varNow;
}

// 取得時間的函式
function get_time(t) {
    var varTime = new Date(),
        varHours = varTime.getHours(),
        varMinutes = varTime.getMinutes(),
        varSeconds = varTime.getSeconds();
    var varNow;
    if (t == "hms") {
        varNow = varHours + ":" + varMinutes + ":" + varSeconds;
    } else if (t == "h") {
        varNow = varHours;
    } else if (t == "m") {
        varNow = varMinutes;
    } else if (t == "s") {
        varNow = varSeconds;
    }
    return varNow;
}