const AWS = require('aws-sdk');
const fs = require('fs');
AWS.config.update({
 region: 'local',
 endpoint: 'http://localhost:8000'
});
let docClient = new AWS.DynamoDB.DocumentClient();
console.log('Start importing');
let allTable = JSON.parse(fs.readFileSync(__dirname+'/data/TTNapthe.json', 'utf-8'));
allTable.forEach((table) => {
    let params = {
        TableName: "ThongTinNapThe",
        Item: {
            "maTaiKhoan":table.maTaiKhoan,
            "tenTaiKhoan":table.tenTaiKhoan,
            "matKhau":table.matKhau,
            "loaiTaiKhoan":table.loaiTaiKhoan,
            "soDuTaiKhoan":table.soDuTaiKhoan,
            "maThongTinNapThe":table.maThongTinNapThe,
            "menhGia":table.menhGia,
            "ngayNap":table.ngayNap,
            "maTheCao":table.maTheCao,
            "seri":table.seri

        }
    };
    docClient.put(params,(err, data) => {
        if (err) {
            console.error(`Unable to add user ${table.maTaiKhoan}, ${JSON.stringify(err, null, 2)}`);
        }else{
            console.log(`User created ${table.maTaiKhoan}`);
        }
    });
});