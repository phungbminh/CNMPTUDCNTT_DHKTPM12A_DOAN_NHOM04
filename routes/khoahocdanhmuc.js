var express = require('express');
var router = express.Router();
const aws = require('aws-sdk');


aws.config.update({
    region: "local",
    endpoint: "http://localhost:8000"
});

let docClient = new aws.DynamoDB.DocumentClient();
router.get('/', function (req, res, next) {
    var params = {
        TableName: "KhoaHoc",
        ExpressionAttributeNames: {
            '#ttkd': 'trangThaiKiemDuyet',
            '#ttkh': 'trangThaiKhoaHoc',
            '#ttbh' : 'trangThaiBaiHoc',
            '#dm' : 'danhMuc'
        },
        ExpressionAttributeValues: {
            ':valTTKD': 'true',
            ':valTTKH': 'true',
            ':valTTBH': 'true',
            ':valDM': String(req.query.danhMuc)
        },
        FilterExpression: '#ttkd = :valTTKD and #ttkh = :valTTKH and #ttbh = :valTTBH and #dm = :valDM',
        ReturnConsumedCapacity: 'TOTAL',
    };
    docClient.scan(params, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            const result = [];
            const map = new Map();
            if(data.Items != null){
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
            }else{
                result = null;
            }

            let sess = req.session;
            console.log(req.session);
            if (sess.user) {
                console.log("co session");
                console.log(sess.user.tenTaiKhoan);
                res.render('khoahocdanhmuc', { listKhoaHoc: result, tenTaiKhoan: sess.user.tenTaiKhoan });
            }
            else {
                console.log("chua co sessioc");
                res.render('khoahocdanhmuc', { listKhoaHoc: result, tenTaiKhoan: null });
            }
        }

    });
});

module.exports = router;