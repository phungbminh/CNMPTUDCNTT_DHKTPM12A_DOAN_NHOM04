var express = require('express');
var router = express.Router();
const aws = require('aws-sdk');


aws.config.update({
    region: "local",
    endpoint: "http://localhost:8000"
});

let docClient = new aws.DynamoDB.DocumentClient();
/* GET home page. */
router.get('/', function(req, res, next) {
    var params = {
        TableName : "KhoaHoc",
        ExpressionAttributeNames: {
            '#makh': 'trangThaiKiemDuyet'
        },
        ExpressionAttributeValues: {
            ':maKhoaHoc': 'true'
        },
        FilterExpression: '#makh = :maKhoaHoc',
        ReturnConsumedCapacity: 'TOTAL',
    };
    docClient.scan(params, (err, data) => {
        if (err) {
             
        } else {
            const result = [];
            const map = new Map();
            for (const item of data.Items) {
                if(!map.has(item.maKhoaHoc)){
                    map.set(item.maKhoaHoc, true);    // set any value to Map
                    result.push({
                        maKhoaHoc: item.maKhoaHoc,
                        tenKhoaHoc: item.tenKhoaHoc,
                        moTaKhoaHoc:item.moTaKhoaHoc,
                        giaKhoaHoc:item.giaKhoaHoc,
                        anhDaiDien:item.anhDaiDien,
                        danhMuc:item.danhMuc
                    });
                }
            }
           
            let sess = req.session;
            console.log(req.session);
            if(sess.user) {
                console.log("co session");
                console.log(sess.user.tenTaiKhoan);
                res.render('home', {listKhoaHoc:result, tenTaiKhoan:sess.user.tenTaiKhoan});
            }
            else {
                console.log("chua co sessioc");
                res.render('home', {listKhoaHoc:result, tenTaiKhoan:null});
            }
        }
           
    });
});
router.post('/login', function(req, res, next) {
    let userName= req.body.userName;
    let password = req.body.password;
    var params = {
        TableName : "User",
        IndexName:'index_TaiKhoan',
        KeyConditionExpression: "#yr = :yyyy",
        ExpressionAttributeNames:{
            "#yr": "tenTaiKhoan"
        },
        ExpressionAttributeValues: {
            ":yyyy": String(userName)
        }
    };
    
    docClient.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
            console.log(data.Items);
            if( data.Items[0] != null){
                if(password == data.Items[0].matKhau && data.Items[0].loaiTaiKhoan == 'hoc_vien') {
                    console.log(data.Items[0].loaiTaiKhoan);
                    var user = {tenTaiKhoan:userName, matKhau:password};
                    req.session.user = user;
                    console.log("Success");
                    res.redirect('/');
                    console.log(req.session.user.tenTaiKhoan);
                   
                }
                else {
                    console.log("Fail");
                    req.session.err = 'Sai tên tài khoản hoặc mật khẩu';
                    console.log(req.session.err);
                    res.redirect('dangnhap');
                    
                }
            }else{
                req.session.err = 'Sai tên tài khoản hoặc mật khẩu';
                console.log(req.session.err);
                res.redirect('dangnhap');
            }
        }
    });
 

});


router.get('/logout', function (req, res, next) {
    req.session.destroy((err) => {
      if(err)
        console.log(err);
    });
    res.redirect('/');
  });
router.get('/thongtincanhan', function (req, res, next) {
    let sess = req.session;
    if(sess.user){
        console.log('co user');
        res.redirect('/');
    }else{
        console.log('chua co user');
        res.redirect('dangnhap');
    }
    
  });
  router.get('/quanlykhoahoc', function (req, res, next) {
    let sess = req.session;
    if(sess.user){
        console.log('co user');
        res.redirect('/');
    }else{
        console.log('chua co user');
        res.redirect('dangnhap');
    }
    
  });
  router.get('/napthe', function (req, res, next) {
    let sess = req.session;
    if(sess.user){
        console.log('co user');
        res.redirect('/');
    }else{
        console.log('chua co user');
        res.redirect('dangnhap');
    }
    
  });

router.get('/thongtinkhoahoc', function (req, res, next) {
    let sess = req.session;
    console.log(req.session);
    if(sess.user) {
        console.log("co session");
        console.log(sess.user.tenTaiKhoan);
        res.render('thongtinkhoahoc', {tenTaiKhoan:sess.user.tenTaiKhoan});
    }
    else {
        console.log("chua co sessioc");
        res.render('thongtinkhoahoc', { tenTaiKhoan:null});
        var maKhoaHoc = req.query.maKhoaHoc;
        var params = {
            TableName : "KhoaHoc",
            ExpressionAttributeNames: {
                '#makh': 'maKhoaHoc',
                '#ttkt' : 'trangThaiKiemDuyet'
            },
            ExpressionAttributeValues: {
                ':maKhoaHoc': Number(maKhoaHoc),
                ':thongTinKD' : 'true'
            },
            FilterExpression: '#makh = :maKhoaHoc and #ttkt = :thongTinKD',
            ReturnConsumedCapacity: 'TOTAL',
        }
        docClient.scan(params, function(err, data) {
            if (err) {
                console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            } else {
                console.log(data.Items);
                if( data.Items[0] != null){
                    
                }
            }
        });
    }
});

module.exports = router;
