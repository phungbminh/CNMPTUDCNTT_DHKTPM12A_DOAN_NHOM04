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
    if(sess.user && sess.user.loaiTaiKhoan == 'admin'){
        var params = {
            TableName: "User",
            ReturnConsumedCapacity: 'TOTAL',
        };
        docClient.scan(params, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                console.log("co session");
                console.log(sess.user);
                res.render('danhsachtaikhoan', { list: data.Items, taiKhoan: sess.user});
            }

        });
    }
    
    else{
        console.log(sess.user && sess.user.loaiTaiKhoan == 'admin');
        res.redirect("dangnhapadmin");
    }
    

});

module.exports = router;