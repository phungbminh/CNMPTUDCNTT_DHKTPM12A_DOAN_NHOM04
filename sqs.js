var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({
    region: 'us-east-1',
    accessKeyId: 'ASIAXORZEYKSUY4FDH7Z',
    secretAccessKey: 'Ypbx6kzWeCohhVXaW2/sMRf6+PNMHw0XJRPzwNvl',
    sessionToken: 'FQoGZXIvYXdzEOf//////////wEaDA/0urLYY8pTBJUiFyKDAg8YIqtuwkBAqOVzFOwuDUetstGmaiRkRpL9eruWg0pO9HT4TnAnlQm1LzFHFuxmOD4Th07iNPQ8GDRafo4OmdkG+9ulbFZu/tV6V/YJHJN0MY4wm89uIsZyP45wSgpNNF+7wDZBOcUZlIcwnlvr325rhkYo2pfpns5WO8LFtX3x8a2WJsTXMfSjB938oYY6mUwulCjGHElA1wkD/jxiwXJhXtXuDhJpHlSJ0U5zEgODR7vth0jVKDJcTBgUJXfqHsimtqRr49lgQqWhjGHM6T2R0GAnaktYxv7DkJQv3JnioBjIPIPPqng7nnu1lvWCBjhIVgIQ8XSiuk8PUPEPW46Isy4osLHt7QU=',

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