var express = require('express');
var router = express.Router();
const aws = require('aws-sdk');


aws.config.update({
    region: "local",
    endpoint: "http://localhost:8000"
});

let docClient = new aws.DynamoDB.DocumentClient();
router.get('/', function (req, res, next) {
    let sess = req.session;
    var maKhoaHoc = req.query.maKhoaHoc;
    if (sess.user) {
        console.log("co session");
        var params = {
            TableName: "ThongTinMuaKhoaHoc",
            ExpressionAttributeNames: {
                '#makh': 'maKhoaHoc',
            },
            ExpressionAttributeValues: {
                ':maKhoaHoc': Number(maKhoaHoc),
            },
            FilterExpression: '#makh = :maKhoaHoc',
            ReturnConsumedCapacity: 'TOTAL',
        }
        docClient.scan(params, function (err, data) {
            if (err) {
                console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            } else {
                console.log(data.Items);
                if (data.Items.length != 0) {
                    res.render('thongtinkhoahoc', { tenTaiKhoan: sess.user.tenTaiKhoan, listBaiHoc: data.Items, soThuTu: req.query.soThuTu });
                } else {
                    var params = {
                        TableName: "KhoaHoc",
                        ExpressionAttributeNames: {
                            '#makh': 'maKhoaHoc',
                            '#ttkd': 'trangThaiKiemDuyet'
                        },
                        ExpressionAttributeValues: {
                            ':maKhoaHoc': Number(maKhoaHoc),
                            ':thongTinKD': 'true'
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
                                res.render('thongtinkhoahoc', { tenTaiKhoan: sess.user.tenTaiKhoan, listBaiHoc: [data.Items[0]], soThuTu: req.query.soThuTu });
                            }
                        }
                    });
                }
            }
        });
    } else {
        var params = {
            TableName: "KhoaHoc",
            ExpressionAttributeNames: {
                '#makh': 'maKhoaHoc',
                '#ttkd': 'trangThaiKiemDuyet'
            },
            ExpressionAttributeValues: {
                ':maKhoaHoc': Number(maKhoaHoc),
                ':thongTinKD': 'true'
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
                    console.log("chua co session");
                    res.render('thongtinkhoahoc', { tenTaiKhoan: null, listBaiHoc: [data.Items[0]], soThuTu: req.query.soThuTu });
                }
            }
        });
    }
});

module.exports = router;