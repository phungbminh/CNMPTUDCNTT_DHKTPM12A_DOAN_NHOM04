var express = require('express');
var router = express.Router();
const aws = require('aws-sdk');



router.get('/', function (req, res, next) {
    let sess = req.session;
    if(sess.err){
        res.render('dangnhap', {error:sess.err});
    }
    else{
        res.render('dangnhap',{error:null});
    }
    
});

module.exports = router;