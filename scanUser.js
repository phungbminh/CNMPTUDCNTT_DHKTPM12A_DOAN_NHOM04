const AWS = require('aws-sdk');
AWS.config.update({
    region: 'local',
    endpoint: 'http://localhost:8000',
});
const docClient = new AWS.DynamoDB.DocumentClient();
const params = {
    TableName: 'User',
};
console.log('Scan ... ');
docClient.scan(params, onScan);
function onScan(err, data) {
    if (err) {
        console.error('Unable to scan the table. Error JSON:', JSON.stringify(err, null, 2));
    } else {
        console.log('Scan succeeded.');
        data.Items.forEach((table) => {
            console.log( table.maTaiKhoan, table.tenTaiKhoan, table.matKhau, table.loaiTaiKhoan, table.soDuTaiKhoan, table.maThanhVien , table.tenThanhVien, table.email, table.diaChi, table.sdt);
        
           
        });
        if (typeof data.LastEvaluatedKey !== 'undefined') {
            console.log('Scanning for more...');
            params.ExclusiveStartKey = data.LastEvaluatedKey;
            docClient.scan(params, onScan);
        }
    }
}