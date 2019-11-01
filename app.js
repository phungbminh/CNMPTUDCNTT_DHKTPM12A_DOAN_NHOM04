var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//const fileUpload = require('express-fileupload');

var multiparty = require('connect-multiparty'), multipartyMiddleware = multiparty();
var indexRouter = require('./routes/home');
var dangNhapRouter = require('./routes/dangnhap');
var dangNhapGVRouter = require('./routes/dangnhapGV');
var thongTinKhoaHocRouter = require('./routes/thongtinkhoahoc');
var napTheRouter = require('./routes/napthe');
var themKhoaHocRouter = require('./routes/themkhoahoc');
var thongTinCaNhanRouter = require('./routes/thongtincanhan');
var khoaHocDanhMucRouter = require('./routes/khoahocdanhmuc');
var dangKyRouter = require('./routes/dangky');
var danhSachKhoaHocRouter = require('./routes/danhsachkhoahoc');
var capNhatKhoaHocRouter = require('./routes/capnhatkhoahoc');
var thongTinGiaoVienRouter = require('./routes/thongtingiaovien');
var timKhaHocRouter = require('./routes/timkhoahoc');
var dangNhapAdminRouter = require('./routes/dangnhapadmin');
var danhSachTaiKhoanRouter = require('./routes/danhsachtaikhoan');
var danhSachKiemDuyet = require('./routes/danhsachkiemduyet');


var session = require('express-session');
var app = express();

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  key: 'user_id',
  secret: '123456',
  saveUninitialized: false,
  resave: false
}));

app.use((req, res, next) => {
  if (req.cookies.user_id && !req.session.user) {
      res.clearCookie('user_id');        
  }
  next();
});
app.use('/', indexRouter);
app.use('/dangnhap', dangNhapRouter);
app.use('/dangnhapGV', dangNhapGVRouter);
app.use('/thongtinkhoahoc', thongTinKhoaHocRouter);
app.use('/napthe', napTheRouter);
app.use('/themkhoahoc', themKhoaHocRouter);
app.use('/thongtincanhan', thongTinCaNhanRouter);
app.use('/danhmuc', khoaHocDanhMucRouter);
app.use('/dangky', dangKyRouter);
app.use('/danhsachkhoahoc', danhSachKhoaHocRouter);
app.use('/capnhatkhoahoc', capNhatKhoaHocRouter);
app.use('/thongtingiaovien', thongTinGiaoVienRouter);
app.use('/timkhoahoc', timKhaHocRouter);
app.use('/dangnhapadmin', dangNhapAdminRouter);
app.use('/admin', danhSachTaiKhoanRouter);
app.use('/danhsachkiemduyet', danhSachKiemDuyet);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
//app.use(fileUpload());
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
