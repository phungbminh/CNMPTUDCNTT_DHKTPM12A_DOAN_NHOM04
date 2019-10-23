var express = require('express');
var session = require('express-session');
var router = express.Router();
const aws = require('aws-sdk');


aws.config.update({
    region: "local",
    endpoint: "http://localhost:8000"
});

let docClient = new aws.DynamoDB.DocumentClient();
/* GET home page. */
router.get('/', function(req, res, next) {
    var params = {
        TableName : "KhoaHoc",
    };
    let listTemp = [];
    docClient.scan(params, (err, data) => {
        if (err) {
             
        } else {
            const result = [];
            const map = new Map();
            for (const item of data.Items) {
                if(!map.has(item.maKhoaHoc)){
                    map.set(item.maKhoaHoc, true);    // set any value to Map
                    result.push({
                        maKhoaHoc: item.maKhoaHoc,
                        tenKhoaHoc: item.tenKhoaHoc,
                        moTaKhoaHoc:item.moTaKhoaHoc,
                        giaKhoaHoc:item.giaKhoaHoc,
                        anhDaiDien:item.anhDaiDien,
                        danhMuc:item.danhMuc
                    });
                }
            }
            res.render('home', {listKhoaHoc:result});
        }
           
    });
});
router.get('/login', function(req, res, next) {
    let userName= req.query.userName;
    let password = req.query.password;
    var params = {
      TableName: 'User',
      IndexName: 'index_TaiKhoan', // optional (if querying an index)
      KeyConditionExpression: "#tk = :yyyy",
      ExpressionAttributeNames:{
          "#tk": "tenTaiKhoan"
      },
      ExpressionAttributeValues: {
          ":yyyy": String(userName)
      },
      ScanIndexForward: true, // optional (true | false) defines direction of Query in the index
      Limit: 5, // optional (limit the number of items to evaluate)
      ConsistentRead: false, // optional (true | false)
      Select: 'ALL_ATTRIBUTES', // optional (ALL_ATTRIBUTES | ALL_PROJECTED_ATTRIBUTES | 
                                //           SPECIFIC_ATTRIBUTES | COUNT)
      ReturnConsumedCapacity: 'NONE', // optional (NONE | TOTAL | INDEXES)
  };
  docClient.query(params, function(err, data) {
      if (err) {
        console.log(err);
      }
      else {
       
        res.redirect('/');
        
        
      }
        
  });

});




module.exports = router;
