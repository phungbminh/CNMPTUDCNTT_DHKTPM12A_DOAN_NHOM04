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
    
    if(sess.errDangKy){
        res.render('dangky', {errDangKy:sess.errDangKy});
    }else{
        res.render('dangky', {errDangKy:null});
    }
    
});

module.exports = router;