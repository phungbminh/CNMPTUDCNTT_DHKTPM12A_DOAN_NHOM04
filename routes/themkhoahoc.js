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
    if(sess.user){
        console.log(sess);
        res.render('themkhoahoc');
    }
    
    else{
        console.log(sess.user);
        res.redirect("dangNhapGV");
    }
    

});

module.exports = router;