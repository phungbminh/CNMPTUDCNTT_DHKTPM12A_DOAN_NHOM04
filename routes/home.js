var express = require('express');
var router = express.Router();
const aws = require('aws-sdk');
const fs = require('fs');
var multiparty = require('connect-multiparty'), multipartyMiddleware = multiparty();
var thems3 = require('../themS3');
aws.config.update({
    region: 'local',
    endpoint: 'http://localhost:8000',
    accessKeyId: 'ab',
    secretAccessKey: 'ab'
});



// The name of the bucket that you have created



// aws.config.update({
//     region: 'us-east-1',
//     accessKeyId: 'ASIAXORZEYKSXWNCUBVM',
//     secretAccessKey: 'my+TS20lGa8S9mlvs88eidI5dXXjZ+eKhSFsTHWN',
//     sessionToken: 'FQoGZXIvYXdzEJr//////////wEaDBqcUUblOfaYsIEcIiKDAnllbEMm1Xht1eXcM4I7A68fJfU1sWatAcmoi6yDJIcc6A/xc2WrsLfZ1jn8ksbFWRYQM2y48SnarkGIwuXMLerwlsKwwyDlJhhQiD9AAMRhOwwXoItP79agJFCc29j3Zlw0JiT8HN/py6lB94hTg1pV0ki+/h1GyukJBk0t9vSgFnM9S2HECrAagYM6fQNIxdo5nkOUvqKbhEg4jyvo3+cnfqm2Sg/CHyi29gZCVhcTxyCJ59STU6Ixo8FnTL2GU28SXDKg7zE5r9Rr9VMW0lPwCQqfVJ8qh8+c3gb1nKt/apyv48ncup82MfOfZoaoyN6TQMig4WeEXLSOxzi7ry3q3UYoq6fc7QU=',
//     endpoint: "http://dynamodb.us-east-1.amazonaws.com/"

// });
let docClient = new aws.DynamoDB.DocumentClient();

/* GET home page. */
router.get('/', function (req, res, next) {
    var params = {
        TableName: "KhoaHoc",
        ExpressionAttributeNames: {
            '#ttkd': 'trangThaiKiemDuyet',
            '#ttkh': 'trangThaiKhoaHoc',
            '#ttbh': 'trangThaiBaiHoc'
        },
        ExpressionAttributeValues: {
            ':valTTKD': 'true',
            ':valTTKH': 'true',
            ':valTTBH': 'true'
        },
        FilterExpression: '#ttkd = :valTTKD and #ttkh = :valTTKH and #ttbh = :valTTBH',
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
                        soThuTu: item.soThuTu
                    });
                }
            }

            let sess = req.session;
            console.log(req.session);
            if (sess.user && sess.user.loaiTaiKhoan == 'hoc_vien') {
                console.log("co session");
                console.log(sess.user);
                res.render('home', { listKhoaHoc: result, tenTaiKhoan: sess.user.tenTaiKhoan });
            }
            else {
                console.log("chua co sessioc");
                res.render('home', { listKhoaHoc: result, tenTaiKhoan: null });
            }
        }

    });
});
router.post('/login', function (req, res, next) {
    let userName = req.body.userName;
    let password = req.body.password;
    var params = {
        TableName: "User",
        IndexName: 'index_TaiKhoan',
        KeyConditionExpression: "#yr = :yyyy",
        ExpressionAttributeNames: {
            "#yr": "tenTaiKhoan"
        },
        ExpressionAttributeValues: {
            ":yyyy": String(userName)
        }
    };

    docClient.query(params, function (err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
            console.log(data.Items);
            if (data.Items[0] != null) {
                if (password == data.Items[0].matKhau && data.Items[0].loaiTaiKhoan == 'hoc_vien') {
                    console.log(data.Items[0].loaiTaiKhoan);
                    var user = {
                        tenTaiKhoan: userName,
                        matKhau: password,
                        maThanhVien: data.Items[0].maThanhVien,
                        tenThanhVien: data.Items[0].tenThanhVien,
                        diaChi: data.Items[0].diaChi,
                        sdt: data.Items[0].sdt,
                        email: data.Items[0].email,
                        maTaiKhoan: data.Items[0].maTaiKhoan,
                        loaiTaiKhoan: data.Items[0].loaiTaiKhoan,
                        soDuTaiKhoan: data.Items[0].soDuTaiKhoan
                    };
                    req.session.user = user;
                    console.log("Success");
                    res.redirect('/');
                    console.log(req.session.user);

                }
                else {
                    console.log("Fail");
                    req.session.err = 'Sai tên tài khoản hoặc mật khẩu';
                    console.log(req.session.err);
                    res.redirect('dangnhap');

                }
            } else {
                req.session.err = 'Sai tên tài khoản hoặc mật khẩu';
                console.log(req.session.err);
                res.redirect('dangnhap');
            }
        }
    });

});


router.get('/logout', function (req, res, next) {
    req.session.destroy((err) => {
        if (err)
            console.log(err);
    });
    res.redirect('/');
});



router.get('/muakhoahoc', function (req, res, next) {
    let sess = req.session;
    let maKhoaHoc = req.query.maKhoaHoc;
    if (sess.user) {
        console.log('co user');
        var params = {
            TableName: "KhoaHoc",
            ExpressionAttributeNames: {
                '#makh': 'maKhoaHoc'
            },
            ExpressionAttributeValues: {
                ':maKhoaHoc': Number(maKhoaHoc)
            },
            FilterExpression: '#makh = :maKhoaHoc',
            ReturnConsumedCapacity: 'TOTAL',
        };
        docClient.scan(params, function (err, data) {
            if (err) {
                console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            } else {
                console.log(data.Items);
                if (data.Items != null) {
                    //Kiểm tra số dư
                    if (sess.user.soDuTaiKhoan < data.Items[0].giaKhoaHoc) {
                        req.session.errSoDuTaiKhoan = "Không đủ số dư tài khoản để thanh toán";
                        res.redirect(req.get('referer'));
                    } else {
                        //Thêm thông tin mua khóa học
                        let maThongTinMua = Math.floor(Math.random() * 10000000);
                        data.Items.forEach(item => {
                            let params2 = {
                                TableName: "ThongTinMuaKhoaHoc",
                                Item: {
                                    "maThanhVien": sess.user.maThanhVien,
                                    "tenThanhVien": sess.user.tenThanhVien,
                                    "sdt": sess.user.sdt,
                                    "diaChi": sess.user.diaChi,
                                    "email": sess.user.email,
                                    "maKhoaHoc": data.Items[0].maKhoaHoc,
                                    "tenKhoaHoc": data.Items[0].tenKhoaHoc,
                                    "anhDaiDien": data.Items[0].anhDaiDien,
                                    "moTaKhoaHoc": data.Items[0].moTaKhoaHoc,
                                    "giaKhoaHoc": data.Items[0].giaKhoaHoc,
                                    "maBaiHoc": item.maBaiHoc,
                                    "url": item.url,
                                    "tenBaiHoc": item.tenBaiHoc,
                                    "moTaBaiHoc": item.moTaBaiHoc,
                                    "maThongTinMuaKhoaHoc": maThongTinMua,
                                    "ngayMua": "2019-10-25",
                                    "soThuTu": item.soThuTu,
                                    "danhMuc": item.danhMuc,
                                    "trangThaiKhoaHoc": item.trangThaiKhoaHoc,
                                    "trangThaiBaiHoc": item.trangThaiBaiHoc,
                                    "trangThaiKiemDuyet": item.trangThaiKiemDuyet
                                }
                            };
                            docClient.put(params2, (err, data) => {
                                if (err) {
                                    console.error(`Unable to add user ${item.maKhoaHoc}, ${JSON.stringify(err, null, 2)}`);
                                    res.redirect(req.get('referer'));
                                } else {
                                    console.log(`User created ${item.maKhoaHoc}`);
                                }
                            });
                        });

                        //Cập nhật lại số dư session user hoc viên
                        let giaKhoaHoc = data.Items[0].giaKhoaHoc
                        let soDuMoi = sess.user.soDuTaiKhoan - giaKhoaHoc;
                        req.session.user.soDuTaiKhoan = soDuMoi;
                        console.log("cập nhật số dư session ");
                        console.log(req.session.user.soDuTaiKhoan);
                        //Cập nhật lại số dư bảng user_ học viên
                        var params3 = {
                            TableName: "User",
                            Key: {
                                "maTaiKhoan": sess.user.maTaiKhoan,
                            },
                            UpdateExpression: "set soDuTaiKhoan= :r",
                            ExpressionAttributeValues: {
                                ":r": Number(soDuMoi)
                            },
                            ReturnValues: "UPDATED_NEW"
                        };

                        console.log("Updating hoc viên");
                        docClient.update(params3, function (err, data) {
                            if (err) {
                                console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
                            } else {
                                console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
                            }
                        });
                        //Tính tiền cho tài khoản giáo viên, cập nhật lại số dư tài khoản giáo viên

                        var params4 = {
                            TableName: "KhoaHoc",
                            IndexName: 'index_KhoaHoc',
                            KeyConditionExpression: "#yr = :yyyy",
                            ExpressionAttributeNames: {
                                "#yr": "maKhoaHoc"
                            },
                            ExpressionAttributeValues: {
                                ":yyyy": Number(maKhoaHoc)
                            }
                        };

                        docClient.query(params4, function (err, data) {
                            if (err) {
                                console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
                            } else {
                                console.log("ma thanh vien..........................")
                                console.log(data.Items[0].maThanhVien);
                                var params6 = {
                                    TableName: "User",
                                    IndexName: 'index_maThanhVien',
                                    KeyConditionExpression: "#yr = :yyyy",
                                    ExpressionAttributeNames: {
                                        "#yr": "maThanhVien"
                                    },
                                    ExpressionAttributeValues: {
                                        ":yyyy": data.Items[0].maThanhVien
                                    }
                                };

                                docClient.query(params6, function (err, data) {
                                    if (err) {
                                        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
                                    } else {
                                        console.log(data.Items[0].maTaiKhoan);

                                        console.log("số dư tài khoản ....")
                                        console.log((giaKhoaHoc * 0.2) + data.Items[0].soDuTaiKhoan);
                                        var params5 = {
                                            TableName: "User",
                                            Key: {
                                                "maTaiKhoan": data.Items[0].maTaiKhoan,
                                            },
                                            UpdateExpression: "set soDuTaiKhoan= :r",
                                            ExpressionAttributeValues: {
                                                ":r": Number((giaKhoaHoc * 0.2) + data.Items[0].soDuTaiKhoan)
                                            },
                                            ReturnValues: "UPDATED_NEW"
                                        };
                                        console.log("Updating thanh viên");
                                        docClient.update(params5, function (err, data) {
                                            if (err) {
                                                console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
                                            } else {
                                                console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
                                            }
                                        });
                                    }

                                });

                            }

                        });

                        res.redirect(req.get('referer'), 302, { alert: null });

                    }
                }
            }
        });
    } else {
        console.log('chua co user');
        res.redirect('dangnhap');
    }

});
router.get('/huynapthe', function (req, res, next) {
    req.session.errSoDuTaiKhoan = null;
    console.log(req.session);
    res.redirect(req.get('referer'), 302, { alert: null });
});

router.post('/nap', function (req, res, next) {
    let loaiThe = req.body.loaiThe;
    let matheCao = req.body.maTheCao;
    let menhGia = req.body.menhGia;
    let seri = req.body.seri;
    let sess = req.session;
    let soDuMoi = Number(sess.user.soDuTaiKhoan) + Number(menhGia);
    let maThongTinNapThe = Math.floor(Math.random() * 10000000);
    //Thêm vào bảng thông tin nạp thẻ
    let params = {
        TableName: "ThongTinNapThe",
        Item: {
            "maTaiKhoan": sess.user.maTaiKhoan,
            "tenTaiKhoan": sess.user.tenTaiKhoan,
            "matKhau": sess.user.matKhau,
            "loaiTaiKhoan": sess.user.loaiTaiKhoan,
            "soDuTaiKhoan": soDuMoi,
            "maThongTinNapThe": maThongTinNapThe,
            "menhGia": menhGia,
            "ngayNap": "2019-20-25",
            "maTheCao": matheCao,
            "seri": seri,
            "loaiThe": loaiThe

        }
    };
    docClient.put(params, (err, data) => {
        if (err) {
            console.error(`Unable to add user ${maThongTinNapThe}, ${JSON.stringify(err, null, 2)}`);
        } else {
            console.log(`User created ${maThongTinNapThe}`);
            
        }
    });
    //cập nhật số dư trên bảng User
    var params2 = {
        TableName: "User",
        Key: {
            "maTaiKhoan": sess.user.maTaiKhoan,
        },
        UpdateExpression: "set soDuTaiKhoan= :r",
        ExpressionAttributeValues: {
            ":r": soDuMoi
        },
        ReturnValues: "UPDATED_NEW"
    };

    console.log("Updating the item...");
    docClient.update(params2, function (err, data) {
        if (err) {
            console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
        }
    });
    //cap nhật số dư trên session
    req.session.user.soDuTaiKhoan = soDuMoi;
    console.log(req.session.user);
    res.redirect('/');
});
router.post('/loginGV', function (req, res, next) {
    let userName = req.body.userName;
    let password = req.body.password;
    var params = {
        TableName: "User",
        IndexName: 'index_TaiKhoan',
        KeyConditionExpression: "#yr = :yyyy",
        ExpressionAttributeNames: {
            "#yr": "tenTaiKhoan"
        },
        ExpressionAttributeValues: {
            ":yyyy": String(userName)
        }
    };

    docClient.query(params, function (err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
            console.log(data.Items);
            if (data.Items[0] != null) {
                if (String(password) == data.Items[0].matKhau && data.Items[0].loaiTaiKhoan == 'giao_vien') {
                    console.log(data.Items[0].loaiTaiKhoan);
                    var user = {
                        tenTaiKhoan: userName,
                        matKhau: password,
                        maThanhVien: data.Items[0].maThanhVien,
                        tenThanhVien: data.Items[0].tenThanhVien,
                        diaChi: data.Items[0].diaChi,
                        sdt: data.Items[0].sdt,
                        email: data.Items[0].email,
                        maTaiKhoan: data.Items[0].maTaiKhoan,
                        loaiTaiKhoan: data.Items[0].loaiTaiKhoan,
                        soDuTaiKhoan: data.Items[0].soDuTaiKhoan
                    };
                    req.session.user = user;
                    console.log("Success");
                    console.log(req.session.user);
                    res.redirect('danhsachkhoahoc');

                }
                else {
                    console.log("Fail");
                    console.log(password);
                    console.log(data.Items[0].matKhau);
                    req.session.errGV = 'Sai tên tài khoản hoặc mật khẩu';
                    console.log(req.session.errGV);
                    res.redirect('dangNhapGV');

                }
            } else {
                req.session.errGV = 'Sai tên tài khoản hoặc mật khẩu';
                console.log(req.session.errGV);
                res.redirect('dangNhapGV');
            }
        }
    });

});
router.post('/signup', function (req, res, next) {
    let maTaiKhoan = Math.floor(Math.random() * 10000000);
    let tenThanhVien = req.body.tenThanhVien;
    let diaChi = req.body.diaChi;
    let sdt = req.body.sdt;
    let email = req.body.email;
    let tenTaiKhoan = req.body.tenTaiKhoan;
    let matKhau = req.body.matKhau;
    let loaiTaiKhoan = req.body.loaiTaiKhoan;
    let maThanhVien = Math.floor(Math.random() * 10000000);
    var params1 = {
        TableName: "User",
        IndexName: 'index_TaiKhoan',
        KeyConditionExpression: "#yr = :yyyy",
        ExpressionAttributeNames: {
            "#yr": "tenTaiKhoan"
        },
        ExpressionAttributeValues: {
            ":yyyy": String(tenTaiKhoan)
        }
    };

    docClient.query(params1, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            if (data.Items[0] != null) {
                req.session.errDangKy = "Tên tài khoản đã tồn tại";
                res.redirect('dangky');
            } else {
                let params = {
                    TableName: "User",
                    Item: {
                        "maTaiKhoan": maTaiKhoan,
                        "tenTaiKhoan": tenTaiKhoan,
                        "matKhau": matKhau,
                        "loaiTaiKhoan": loaiTaiKhoan,
                        "soDuTaiKhoan": 0,
                        "maThanhVien": maThanhVien,
                        "tenThanhVien": tenThanhVien,
                        "sdt": sdt,
                        "diaChi": diaChi,
                        "email": email
                    }
                };
                docClient.put(params, (err, data) => {
                    if (err) {
                        console.error(`Unable to add user ${maTaiKhoan}, ${JSON.stringify(err, null, 2)}`);
                    } else {
                        req.session.errDangKy = null;
                        res.redirect('/', 302);
                    }
                });

            }
        }

    });


});


router.post('/themkhoahocform', multipartyMiddleware, function (req, res, next) {
    let count = 1;
    let maKhoaHoc = Math.floor(Math.random() * 999999999);
    let maThongTinKiemDuyet = Math.floor(Math.random() * 999999999);
    let sess = req.session;
    if(sess.user){
        console.log(sess.user)
    }
    console.log(req.body.tuakhoahoc);
    console.log(req.files.anhdaidien.type);
    console.log(req.body.giakhoahoc);
    console.log(req.body.mota);
    console.log(req.body.danhMuc);
    thems3.themS3(req.files.anhdaidien, "khoahoc"+ String(maKhoaHoc), "data/images/");
    while(true){
        if(req.files["url" + String(count)] == null){
            break;
        }
        let maBaiHoc = Math.floor(Math.random() * 999999999);
        console.log(req.body["tenBaiHoc" + String(count)]);
        console.log(req.body["moTa" + String(count)]);
        console.log(req.files["url" + String(count)]);
        thems3.themS3(req.files["url" + String(count)], "baihoc"+ String(maBaiHoc), "data/video/");
        console.log('Start importing');
        let params = {
            TableName: "KhoaHoc",
            Item: {
                "maThanhVien":sess.user.maThanhVien,
                "tenThanhVien":sess.user.tenThanhVien,
                "sdt":sess.user.sdt,
                "diaChi":sess.user.diaChi,
                "email":sess.user.email,
                "maKhoaHoc":maKhoaHoc,
                "tenKhoaHoc":req.body.tuakhoahoc,
                "anhDaiDien":"https://doanbutket.s3.amazonaws.com/data/images/khoahoc"+ String(maKhoaHoc) ,
                "moTaKhoaHoc":req.body.mota,
                "giaKhoaHoc":req.body.giakhoahoc,
                "maBaiHoc":maBaiHoc,
                "url":"https://doanbutket.s3.amazonaws.com/data/video/baihoc"+ String(maBaiHoc),
                "tenBaiHoc":req.body["tenBaiHoc" + String(count)],
                "moTaBaiHoc":req.body["moTa" + String(count)],
                "maThongTinKiemDuyet": Number(maThongTinKiemDuyet),
                "ngayKiemDuyet":"2019-12-24",
                "trangThaiKiemDuyet":"true",
                "danhMuc":req.body.danhMuc,
                "soThuTu":count,
                "trangThaiKhoaHoc":"true",
                "trangThaiBaiHoc":"true"

            }
        };
        docClient.put(params,(err, data) => {
            if (err) {
                console.error(`Unable to add user ${maKhoaHoc}, ${JSON.stringify(err, null, 2)}`);
                
            }else{
                console.log(`User created ${maKhoaHoc}`);

                
            }
        });
                        
        count = count + 1;

    }
    res.redirect("danhsachkhoahoc");
    //thems3.themS3(req.files.anhdaidien, "haha", res, req);
    



});
router.post('/capnhat', multipartyMiddleware, function (req, res, next) {
    
    let maKhoaHoc = req.body.maKhoaHoc;
    let maThongTinKiemDuyet = Math.floor(Math.random() * 999999999);
    let ranUpdate = Math.floor(Math.random() * 999999999);
    let sess = req.session;
    let listBaiHoc = [];
    if(sess.user){
        console.log(sess.user)
    }
    console.log(req.body.tuakhoahoc);
    console.log(req.files.anhdaidien.type);
    console.log(req.body.giakhoahoc);
    console.log(req.body.mota);
    console.log(req.body.danhMuc);
    let count = 0;
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
            if (data.Items != null) {
                if(data.Items != null){
                 
                    console.log(data.Items);
                }

            }
        }
    });
    //thems3.themS3(req.files.anhdaidien, String(ranUpdate)+"khoahoc"+ String(maKhoaHoc), "data/images/");
    while(true){
        if(req.files["url" + String(count)] == null){
            break;
        }
        
        console.log(req.body["tenBaiHoc" + String(count)]);
        console.log(req.body["moTa" + String(count)]);
        console.log(req.files["url" + String(count)]);
       
        count = count + 1;
    }
     
                          //thems3.themS3(req.files["url" + String(count)],String(ranUpdate)+ "baihoc"+ String(maBaiHoc), "data/video/");
                    // console.log('Start importing');
                    // let params = {
                    //     TableName: "KhoaHoc",
                    //     Item: {
                    //         "maThanhVien": maThanhVien,
                    //         "tenThanhVien":sess.user.tenThanhVien,
                    //         "sdt":sess.user.sdt,
                    //         "diaChi":sess.user.diaChi,
                    //         "email":sess.user.email,
                    //         "maKhoaHoc":maKhoaHoc,
                    //         "tenKhoaHoc":req.body.tuakhoahoc,
                    //         "anhDaiDien":"https://doanbutket.s3.amazonaws.com/data/images/"+String(ranUpdate)+"khoahoc"+ String(maKhoaHoc) ,
                    //         "moTaKhoaHoc":req.body.mota,
                    //         "giaKhoaHoc":req.body.giakhoahoc,
                    //         "maBaiHoc":maBaiHoc,
                    //         "url":"https://doanbutket.s3.amazonaws.com/data/video/"+String(ranUpdate)+"baihoc"+ String(maBaiHoc),
                    //         "tenBaiHoc":req.body["tenBaiHoc" + String(count)],
                    //         "moTaBaiHoc":req.body["moTa" + String(count)],
                    //         "maThongTinKiemDuyet": Number(maThongTinKiemDuyet),
                    //         "ngayKiemDuyet":"2019-12-24",
                    //         "trangThaiKiemDuyet":"true",
                    //         "danhMuc":req.body.danhMuc,
                    //         "soThuTu":count,
                    //         "trangThaiKhoaHoc":"true",
                    //         "trangThaiBaiHoc":"true"

                    //     }
                    // };
                    // docClient.put(params,(err, data) => {
                    //     if (err) {
                    //         console.error(`Unable to add user ${maKhoaHoc}, ${JSON.stringify(err, null, 2)}`);
                            
                    //     }else{
                    //         console.log(`User created ${maKhoaHoc}`);

                            
                    //     }
                    // });
        
        
                        
        

   
    res.redirect("danhsachkhoahoc");

    



});


module.exports = router;