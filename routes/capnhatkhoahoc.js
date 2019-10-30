var express = require('express');
var router = express.Router();
const aws = require('aws-sdk');


aws.config.update({
    region: "local",
    endpoint: "http://localhost:8000"
});

let docClient = new aws.DynamoDB.DocumentClient();

router.get('/', function (req, res, next) {
    let maKhoaHoc = req.query.maKhoaHoc;
    let sess = req.session;
    if(sess.user){
        var params = {
            TableName: "KhoaHoc",
            ExpressionAttributeNames: {
                '#makh': 'maKhoaHoc',
                '#ttkd': 'trangThaiKiemDuyet',

            },
            ExpressionAttributeValues: {
                ':maKhoaHoc': Number(maKhoaHoc),
                ':thongTinKD': 'true',
            },
            FilterExpression: '#makh = :maKhoaHoc and #ttkd = :thongTinKD',
            ReturnConsumedCapacity: 'TOTAL',
        }
        docClient.scan(params, function (err, data) {
            if (err) {
                console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            } else {
                console.log(data.Items);
                if (data.Items != null) {
                  res.render('capnhatkhoahoc', {listBaiHoc: data.Items, taiKhoan:sess.user});
                  
                }
            }
        });

    }
    
    else{
        console.log(sess.user);
        res.redirect("dangNhapGV");
    }
    

});

module.exports = router;