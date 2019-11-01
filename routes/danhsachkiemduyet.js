var express = require('express');
var router = express.Router();
const aws = require('aws-sdk');
var sqs = require('../sqs');
aws.config.update({
    region: 'local',
    endpoint: 'http://localhost:8000',
    accessKeyId: 'ab',
    secretAccessKey: 'ab'
});

let docClient = new aws.DynamoDB.DocumentClient();
router.get('/', function (req, res, next) {
    let sess = req.session;
    if(sess.user && sess.user.loaiTaiKhoan == 'admin'){
        sqs.recevie(res, sess.user);
    }
    else{
        console.log(sess.user && sess.user.loaiTaiKhoan == 'admin');
        res.redirect("dangnhapadmin");
    }
    

});

module.exports = router;