var express = require('express');
var router = express.Router();
const aws = require('aws-sdk');


aws.config.update({
    region: "local",
    endpoint: "http://localhost:8000"
});

let docClient = new aws.DynamoDB.DocumentClient();
/* GET home page. */
router.get('/', function (req, res, next) {
    var params = {
        TableName: "KhoaHoc",
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
            if (sess.user) {
                console.log("co session");
                console.log(sess.user.tenTaiKhoan);
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
router.get('/thongtincanhan', function (req, res, next) {
    let sess = req.session;
    if (sess.user) {
        console.log('co user');
        res.redirect('/');
    } else {
        console.log('chua co user');
        res.redirect('dangnhap');
    }

});
router.get('/quanlykhoahoc', function (req, res, next) {
    let sess = req.session;
    if (sess.user) {
        console.log('co user');
        res.redirect('/');
    } else {
        console.log('chua co user');
        res.redirect('dangnhap');
    }

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
                                    "danhMuc": item.danhMuc
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
router.get('/hihi', function (req, res, next) {
    var params6 = {
        TableName: "User",
        IndexName: 'index_maThanhVien',
        KeyConditionExpression: "#yr = :yyyy",
        ExpressionAttributeNames: {
            "#yr": "maThanhVien"
        },
        ExpressionAttributeValues: {
            ":yyyy": 2
        }
    };

    docClient.query(params6, function (err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
            console.log(data.Items);

        }

    });
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
            res.redirect('/');
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
});



module.exports = router;
