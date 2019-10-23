const AWS = require('aws-sdk');
const fs = require('fs');
AWS.config.update({
 region: 'local',
 endpoint: 'http://localhost:8000'
});
let docClient = new AWS.DynamoDB.DocumentClient();
console.log('Start importing');
let allTable = JSON.parse(fs.readFileSync(__dirname+'/data/TTMuaKhoaHoc.json', 'utf-8'));
allTable.forEach((table) => {
    let params = {
        TableName: "ThongTinMuaKhoaHoc",
        Item: {
            "maThanhVien":table.maThanhVien,
            "tenThanhVien":table.tenThanhVien,
            "sdt":table.sdt,
            "diaChi":table.diaChi,
            "email":table.email,
            "maKhoaHoc":table.maKhoaHoc,
            "tenKhoaHoc":table.tenKhoaHoc,
            "anhDaiDien":table.anhDaiDien,
            "moTaKhoaHoc":table.moTaKhoaHoc,
            "giaKhoaHoc":table.giaKhoaHoc,
            "maBaiHoc":table.maBaiHoc,
            "url":table.url,
            "tenBaiHoc":table.tenBaiHoc,
            "moTaBaiHoc":table.moTaBaiHoc,
            "maThongTinMuaKhoaHoc":table.maThongTinMuaKhoaHoc,
            "ngayMua":table.ngayMua

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