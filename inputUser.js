const AWS = require('aws-sdk');
const fs = require('fs');
AWS.config.update({
 region: 'local',
 endpoint: 'http://localhost:8000'
});
// AWS.config.update({
//     region: 'us-east-1',
//     accessKeyId: 'ASIAXORZEYKSXWNCUBVM',
//     secretAccessKey: 'my+TS20lGa8S9mlvs88eidI5dXXjZ+eKhSFsTHWN',
//     sessionToken: 'FQoGZXIvYXdzEJr//////////wEaDBqcUUblOfaYsIEcIiKDAnllbEMm1Xht1eXcM4I7A68fJfU1sWatAcmoi6yDJIcc6A/xc2WrsLfZ1jn8ksbFWRYQM2y48SnarkGIwuXMLerwlsKwwyDlJhhQiD9AAMRhOwwXoItP79agJFCc29j3Zlw0JiT8HN/py6lB94hTg1pV0ki+/h1GyukJBk0t9vSgFnM9S2HECrAagYM6fQNIxdo5nkOUvqKbhEg4jyvo3+cnfqm2Sg/CHyi29gZCVhcTxyCJ59STU6Ixo8FnTL2GU28SXDKg7zE5r9Rr9VMW0lPwCQqfVJ8qh8+c3gb1nKt/apyv48ncup82MfOfZoaoyN6TQMig4WeEXLSOxzi7ry3q3UYoq6fc7QU=',
//     endpoint: "http://dynamodb.us-east-1.amazonaws.com/"

// });
let docClient = new AWS.DynamoDB.DocumentClient();
console.log('Start importing');
let allTable = JSON.parse(fs.readFileSync(__dirname+'/data/user.json', 'utf-8'));
allTable.forEach((table) => {
    let params = {
        TableName: "User",
        Item: {
            "maTaiKhoan": table.maTaiKhoan,
            "tenTaiKhoan": table.tenTaiKhoan,
            "matKhau": table.matKhau,
            "loaiTaiKhoan":table.loaiTaiKhoan,
            "soDuTaiKhoan":table.soDuTaiKhoan,
            "maThanhVien":table.maThanhVien,
            "tenThanhVien":table.tenThanhVien,
            "sdt":table.sdt,
            "diaChi":table.diaChi,
            "email":table.email
        }
    };
    docClient.put(params,(err, data) => {
        if (err) {
            console.error(`Unable to add user ${table.maThanhVien}, ${JSON.stringify(err, null, 2)}`);
        }else{
            console.log(`User created ${table.maThanhVien}`);
        }
    });
});