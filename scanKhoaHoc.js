const AWS = require('aws-sdk');
AWS.config.update({
    region: 'local',
    endpoint: 'http://localhost:8000',
});
const docClient = new AWS.DynamoDB.DocumentClient();
var params = {
    TableName : "KhoaHoc",
    // ExpressionAttributeNames: {
    //     '#makh': 'maKhoaHoc'
    // },
    // ExpressionAttributeValues: {
    //     ':maKhoaHoc': 2
    // },
    // FilterExpression: '#makh = :maKhoaHoc',
    // ReturnConsumedCapacity: 'TOTAL',
};
console.log('Scan ... ');
docClient.scan(params, onScan);
function onScan(err, data) {
    if (err) {
        console.error('Unable to scan the table. Error JSON:', JSON.stringify(err, null, 2));
    } else {
        console.log('Scan succeeded.');
        data.Items.forEach((table) => {
            console.log( table.maThanhVien
                , table.tenThanhVien, table.email, table.diaChi, table.sdt, table.maKhoaHoc, table.tenKhoaHoc, table.moTaKhoaHoc
                , table.giaKhoaHoc, table.maBaiHoc,table.url ,table.tenBaiHoc, table.moTaBaiHoc, table.maThongTinKiemDuyet, 
                table.ngayKiemDuyet, table.trangThaiKiemDuyet, table.soThuTu, 
                table.trangThaiKhoaHoc, table.trangThaiBaiHoc, table.anhDaiDien, table.danhMuc);
        
           
        });
        if (typeof data.LastEvaluatedKey !== 'undefined') {
            console.log('Scanning for more...');
            params.ExclusiveStartKey = data.LastEvaluatedKey;
            docClient.scan(params, onScan);
        }
    }
}