var express = require('express');
var router = express.Router();
const aws = require('aws-sdk');
aws.config.update({
    region: 'local',
    endpoint: 'http://localhost:8000',
    accessKeyId: 'ab',
    secretAccessKey: 'ab'
});

let docClient = new aws.DynamoDB.DocumentClient();
router.get('/', function (req, res, next) {
    let sess = req.session;
    if(sess.user){
        var params = {
            TableName: "KhoaHoc",
            ExpressionAttributeNames: {
                '#ttkd': 'trangThaiKiemDuyet',
                '#matv' :'maThanhVien'
            },
            ExpressionAttributeValues: {
                ':valTTKD': 'khong_hop_le',
                ':valMTV': Number(sess.user.maThanhVien)
            },
            FilterExpression: '#ttkd = :valTTKD and #matv = :valMTV',
            ReturnConsumedCapacity: 'TOTAL',
        };
        docClient.scan(params, (err, data) => {
            if (err) {
                console.log("Lỗi nè ");
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
                            soThuTu: item.soThuTu,
                            trangThaiKhoaHoc:item.trangThaiKhoaHoc,
                            trangThaiKiemDuyet: item.trangThaiKiemDuyet
                        });
                    }
                }
    
                let sess = req.session;
                console.log(req.session);
                if (sess.user && sess.user.loaiTaiKhoan == 'giao_vien') {
                    console.log("co session");
                    console.log(sess.user);
                    console.log(sess.errVideo);
                    res.render('danhsachkhonghople', { listKhoaHoc: result, taiKhoan: sess.user});
                }
                else {
                    console.log("chua co sessioc");
                    res.render('danhsachkhonghople', { listKhoaHoc: result, taiKhoan: null });
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