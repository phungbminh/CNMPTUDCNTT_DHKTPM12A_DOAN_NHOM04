
var express = require('express');
var router = express.Router();
const aws = require('aws-sdk');
aws.config.update({
    region: "local",
    endpoint: "http://localhost:8000"
});

let docClient = new aws.DynamoDB.DocumentClient();
router.get('/', function (req, res, next) {
    req.session.errSoDuTaiKhoan = null;
    let sess = req.session;
    if (sess.user) {
        console.log('co user');
        res.render('napthe', {tenTaiKhoan: sess.user.tenTaiKhoan});
    } else {
        console.log('chua co user');
        res.redirect('dangnhap');
    }
});
module.exports = router;