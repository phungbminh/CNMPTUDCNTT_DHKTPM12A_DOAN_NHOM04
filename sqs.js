var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({
    region: 'us-east-1',
    accessKeyId: 'ASIAXORZEYKSWAT6OEYY',
    secretAccessKey: 'fXVqNaD35z4dV7Vul9MlaALnfgI1pt9ps/zhGpx7',
    sessionToken: 'FwoGZXIvYXdzEBMaDC5rLGRiWppA4Fj7TCLDAUo3m8aJgO2IELSQsCv6QH312AXOD/wDEBu4KOe8bq62tIxomTQhYGLY1H9uFXzfUItMYYADOZK6vVp8ZVaMQfc03lCxDmJ3FDJbWQc7kr7GOodILHCUbRZyH1tlQy+NoHZc6dFG6bYyhVjPYlWemNkw1Wtxuft6rwslb4cqQ9yJa1+mP8QF4kLlSc+xiZ5YlEQwjNREba/wR/Sd/o/42OBKmowcnIWNT1d3p7qrJuZtuJeEGCHOb7edeAvHKoA42iL6pCiQ7/btBTItzBcKDA4WxovgJ5V8/7gVsOZ2OhdsnKhM3h+vIST02h58FCWyvV/ikd7PQ5Cr',

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