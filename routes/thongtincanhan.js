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
    console.log(req.session);
    if (sess.user && sess.user.loaiTaiKhoan == 'hoc_vien') {
    var params = {
        TableName: "ThongTinMuaKhoaHoc",
        ExpressionAttributeNames: {
            '#ttkd': 'trangThaiKiemDuyet',
            '#ttkh': 'trangThaiKhoaHoc',
            '#ttbh' : 'trangThaiBaiHoc',
            '#matv' : 'maThanhVien'
        },
        ExpressionAttributeValues: {
            ':valTTKD': 'true',
            ':valTTKH': 'true',
            ':valTTBH': 'true',
            ':valMTV' : Number(sess.user.maThanhVien)
        },
        FilterExpression: '#ttkd = :valTTKD and #ttkh = :valTTKH and #ttbh = :valTTBH and #matv = :valMTV',
        ReturnConsumedCapacity: 'TOTAL',
    };
    docClient.scan(params, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            const result = [];
            const map = new Map();
            for (const item of data.Items) {
                if (!map.has(item.maKhoaHoc)) {
                    map.set(item.maKhoaHoc, true);    // set any value to Map
                    result.push({
                        maKhoaHoc: item.maKhoaHoc,
                        tenKhoaHoc: item.tenKhoaHoc,
                        moTaKhoaHoc: item.moTaKhoaHoc,
                        giaKhoaHoc: item.giaKhoaHoc,
                        anhDaiDien: item.anhDaiDien,
                        danhMuc: item.danhMuc,
                        anhDaiDien: item.anhDaiDien,
                        maBaiHoc: item.maBaiHoc,
                        url: item.url,
                        soThuTu: item.soThuTu
                    });
                }
            }

           
            
                console.log("co session");
                console.log(sess.user.tenTaiKhoan);
                console.log(result);
                console.log(data.Items);
                res.render('thongtincanhan', { listKhoaHoc: result, taiKhoan: sess.user });
            
        }

    });
    }
        else {
            console.log("chua co sessioc");
            res.redirect('/dangnhap');
        }
        

});

module.exports = router;