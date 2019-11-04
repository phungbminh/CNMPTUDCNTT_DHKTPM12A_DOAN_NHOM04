var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({
    region: 'us-east-1',
    accessKeyId: 'ASIAXORZEYKSZJ4JIYB3',
    secretAccessKey: '/OT0kR5FwWzn9QQNLEF+ij+Av922zdfCQJ6T959C',
    sessionToken: 'FwoGZXIvYXdzEEIaDFVU1JEr0M6xcgbouSLDAdiQ8XwIxF0Wl2dJ0JQneDRQFRk68gLc9CXzgkWazgjfidb11etudfjjZcnHXvLiSFaLlDIGxWx1y8BWrgat43XlP/QBxPet4prkBjiPkMuiQSej4aJBY3gx/IBpJrhskgYtqAdQY+VSZbsYjb50A1gI8L45TM4/uuPmelEAjYm9Xe7H/0RPOHXhXd+H9zTw+zNUZQlRIddbYEx94f74U3heZLKLL1/C6y+YCHaAp86nCwrApL8D8OSmeDkZhCj3r5yg5yjkrYHuBTIt7bdbnw9PyxkGp37aBbV7w+SGvdHDB2fsfyaXwif36McwXds9xPYrXxchIk66',

});

// Create an SQS service object
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

function send(obj) {
    console.log(obj)
    let params = {
        MessageBody: JSON.stringify(obj),
        QueueUrl: "https://sqs.us-east-1.amazonaws.com/512294699685/doan2_queue",
        MessageAttributes: {
            someKey: { DataType: 'String', StringValue: "string"}
        }
    };
    sqs.sendMessage(params, function(err, data) {
      if (err) 
        console.log( err.stack) // an error occurred
      else 
          console.log(data)        // successful response
    });  
  }
  function recevie(res, taiKhoan) {
    var params = {
        QueueUrl: "https://sqs.us-east-1.amazonaws.com/512294699685/doan2_queue",
        MaxNumberOfMessages: 1
    };
    
    sqs.receiveMessage(params, function(err, data) {
        if(err){
            res.render("danhsachkiemduyet", {taiKhoan:taiKhoan,list:null, receiptHandle:null, err:null});
        }else if(data.Messages){
            var obj = [];
            obj = JSON.parse(data.Messages[0].Body);
            let receiptHandle = data.Messages[0].ReceiptHandle;
            console.log(obj);
            console.log("recep: ");
            console.log(receiptHandle);
            res.render("danhsachkiemduyet", {taiKhoan:taiKhoan,list:obj, receiptHandle:receiptHandle, err:null});
        }else{
            res.render("danhsachkiemduyet", {taiKhoan:taiKhoan,list:null, receiptHandle:null, err:null});
        }
    
            
       
            
        
    });
            
            

  
    
  }
function deleteQueue(res, taiKhoan){
    var params = {
        QueueUrl: "https://sqs.us-east-1.amazonaws.com/512294699685/doan2_queue",
        MaxNumberOfMessages: 1
    };
    sqs.receiveMessage(params, function(err, data) {
        if (err) {
          console.log("Receive Error", err);
        } else if (data.Messages) {
            var deleteParams = {
                QueueUrl: "https://sqs.us-east-1.amazonaws.com/512294699685/doan2_queue",
                ReceiptHandle: data.Messages[0].ReceiptHandle
            };
            sqs.deleteMessage(deleteParams, function(err, data) {
                if (err) {
                console.log("Delete Error", err);
                } else {
                console.log("Message Deleted", data);
                res.redirect("danhsachkiemduyet");
                }
            });
        }else{
            res.render("danhsachkiemduyet",{taiKhoan:taiKhoan,list:null, receiptHandle:null});
        }
    });
    
    
}
module.exports = {
    send:send,
    recevie:recevie,
    deleteQueue:deleteQueue
}
//send({"ten": "phung"});
//recevie();
//deleteQueue();