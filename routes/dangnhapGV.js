var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    let sess = req.session;
    if(sess.errGV){
        res.render('dangnhapGV', {error:sess.errGV});
    }
    else{
        res.render('dangnhapGV',{error:null});
    }
    
});

module.exports = router;