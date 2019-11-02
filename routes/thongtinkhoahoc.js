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
    console.log(maKhoaHoc);
    //da dang nhap , kiem tra bai hoc trong thong tin mua
    if (sess.user && sess.user.loaiTaiKhoan == 'hoc_vien') {
        console.log("co session");
        var params = {
            TableName: "ThongTinMuaKhoaHoc",
            ExpressionAttributeNames: {
                '#makh': 'maKhoaHoc',
                '#ttkh': 'trangThaiKhoaHoc',
                '#ttbh' : 'trangThaiBaiHoc',
                '#matv' : 'maThanhVien'
            },
            ExpressionAttributeValues: {
                ':maKhoaHoc': Number(maKhoaHoc),
                ':valTTKH': 'true',
                ':valTTBH': 'true',
                ':valMTV' : Number(sess.user.maThanhVien)
            },
            FilterExpression: '#makh = :maKhoaHoc and #ttkh = :valTTKH and #ttbh = :valTTBH and #matv = :valMTV',
            ReturnConsumedCapacity: 'TOTAL',
        }
        docClient.scan(params, function (err, data) {
            if (err) {
                console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            } else {
                console.log("Thông tin khóa học đã mua");
                console.log(Number(maKhoaHoc));
                console.log(sess.user.maThanhVien);
                console.log(data.Items);
                //neu co bai trong thong tin mua thi in ma hinh
                if (data.Items.length != 0) {
                    res.render('thongtinkhoahoc', { tenTaiKhoan: sess.user.tenTaiKhoan, listBaiHoc: data.Items, soThuTu: req.query.soThuTu , alert:null});
                //nguoc laij neu chua mua thi vao bang khoa oc tim kiem va in ra 1 bai
                } else {
                    var params = {
                        TableName: "KhoaHoc",
                        ExpressionAttributeNames: {
                            '#makh': 'maKhoaHoc',
                            '#ttkd': 'trangThaiKiemDuyet',
                            '#ttkh': 'trangThaiKhoaHoc',
                             '#ttbh' : 'trangThaiBaiHoc'
                        },
                        ExpressionAttributeValues: {
                            ':maKhoaHoc': Number(maKhoaHoc),
                            ':thongTinKD': 'true',
                            ':valTTKH': 'true',
                            ':valTTBH': 'true'
                        },
                        FilterExpression: '#makh = :maKhoaHoc and #ttkd = :thongTinKD and #ttkh = :valTTKH and #ttbh = :valTTBH',
                        ReturnConsumedCapacity: 'TOTAL',
                    }
                    docClient.scan(params, function (err, data) {
                        if (err) {
                            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
                        } else {
                            console.log(data.Items);
                            if (data.Items != null) {
                                console.log(sess.errSoDuTaiKhoan);
                                data.Items.forEach(item =>{
                                    if(item.soThuTu == 1){
                                        res.render('thongtinkhoahoc', { tenTaiKhoan: sess.user.tenTaiKhoan, listBaiHoc: [item], soThuTu: req.query.soThuTu ,alert:sess.errSoDuTaiKhoan});
                                    }
                                })
                            }
                        }
                    });
                }
            }
        });
    //nguoc lai neu chua dang dang nha thi tim trong bng khoa hoc in ra 1 bai
    } else {
        var params = {
            TableName: "KhoaHoc",
            ExpressionAttributeNames: {
                '#makh': 'maKhoaHoc',
                '#ttkd': 'trangThaiKiemDuyet',
                '#ttkh': 'trangThaiKhoaHoc',
                '#ttbh' : 'trangThaiBaiHoc'
            },
            ExpressionAttributeValues: {
                ':maKhoaHoc': Number(maKhoaHoc),
                ':thongTinKD': 'true',
                ':valTTKH': 'true',
                ':valTTBH': 'true'
            },
            FilterExpression: '#makh = :maKhoaHoc and #ttkd = :thongTinKD and #ttkh = :valTTKH and #ttbh = :valTTBH',
            ReturnConsumedCapacity: 'TOTAL',
        }
        docClient.scan(params, function (err, data) {
            if (err) {
                console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            } else {
                console.log(data.Items);
                if (data.Items != null) {
                    console.log("chua co session");
                    data.Items.forEach(item =>{
                        if(item.soThuTu == 1){
                            res.render('thongtinkhoahoc', { tenTaiKhoan: null, listBaiHoc: [item], soThuTu: req.query.soThuTu,alert:null });
                        }
                    })
                }
            }
        });
    }
});

module.exports = router;