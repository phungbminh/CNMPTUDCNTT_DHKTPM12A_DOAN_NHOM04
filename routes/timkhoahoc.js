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
    var params = {
        TableName: "KhoaHoc",
        ExpressionAttributeNames: {
            '#ttkd': 'trangThaiKiemDuyet',
            '#ttbh' :'trangThaiBaiHoc',
            '#ttkh': 'trangThaiKhoaHoc'
        },
        ExpressionAttributeValues: {
            ':valTTKD': 'true',
            ':valTTKH': 'true',
            ':valTTBH': 'true'
        },
        FilterExpression: '#ttkd = :valTTKD and #ttbh = :valTTBH and #ttkh = :valTTKH',
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
                            soThuTu: item.soThuTu,
                            trangThaiKhoaHoc:item.trangThaiKhoaHoc,
                            trangThaiKiemDuyet: item.trangThaiKiemDuyet
                        });
                    }
                }
            
                let sess = req.session;
                let result2 = []
                result.forEach(item =>{
                    const keywordArr = req.query.tenKhoaHoc.split(' ');
                    console.log(keywordArr);
                    const message = item.tenKhoaHoc;
                    let names = keywordArr.reduce((r,v) => message.toLowerCase().includes(v.toLowerCase()) && r.concat(v) || r, []);
                    if(names != "" || req.query.tenKhoaHoc == ""){
                        result2.push(item);
                    }
                    
                })

                console.log(result2);
                if (sess.user && sess.user.loaiTaiKhoan == 'hoc_vien') {
                    console.log("co session");
                    res.render('timkhoahoc', { listKhoaHoc: result2, tenTaiKhoan: sess.user.tenTaiKhoanr});
                }
                else {
                    console.log("chua co sessioc");
                    res.render('timkhoahoc', { listKhoaHoc: result2, tenTaiKhoan: null });
                }
          
        }

    });
    
    
    

});

module.exports = router;