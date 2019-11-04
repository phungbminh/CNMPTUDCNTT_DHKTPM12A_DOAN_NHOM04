const AWS = require('aws-sdk');
AWS.config.update({
    region: "local",
    endpoint: "http://localhost:8000"
});
// aws.config.update({
//     region: 'us-east-1',
//     accessKeyId: 'ASIAXORZEYKSXWNCUBVM',
//     secretAccessKey: 'my+TS20lGa8S9mlvs88eidI5dXXjZ+eKhSFsTHWN',
//     sessionToken: 'FQoGZXIvYXdzEJr//////////wEaDBqcUUblOfaYsIEcIiKDAnllbEMm1Xht1eXcM4I7A68fJfU1sWatAcmoi6yDJIcc6A/xc2WrsLfZ1jn8ksbFWRYQM2y48SnarkGIwuXMLerwlsKwwyDlJhhQiD9AAMRhOwwXoItP79agJFCc29j3Zlw0JiT8HN/py6lB94hTg1pV0ki+/h1GyukJBk0t9vSgFnM9S2HECrAagYM6fQNIxdo5nkOUvqKbhEg4jyvo3+cnfqm2Sg/CHyi29gZCVhcTxyCJ59STU6Ixo8FnTL2GU28SXDKg7zE5r9Rr9VMW0lPwCQqfVJ8qh8+c3gb1nKt/apyv48ncup82MfOfZoaoyN6TQMig4WeEXLSOxzi7ry3q3UYoq6fc7QU=',
//     endpoint: "http://dynamodb.us-east-1.amazonaws.com/"

// });
let dynamodb = new AWS.DynamoDB();
var params = {
    TableName : "KhoaHoc",
    KeySchema: [
        { AttributeName: "maKhoaHoc", KeyType: "HASH"},  //Partition key
        { AttributeName: "maBaiHoc", KeyType: "RANGE" },  //Sort key
    ],
    AttributeDefinitions: [
        { AttributeName: "maBaiHoc", AttributeType: "N" },
        { AttributeName: "maKhoaHoc", AttributeType: "N" },
        { AttributeName: "maThongTinKiemDuyet", AttributeType: "N" },
        { AttributeName: "soThuTu", AttributeType: "N" }
       
    ],
   
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
    },
    GlobalSecondaryIndexes: [
        {
            IndexName: 'index_KhoaHoc',
            KeySchema: [
                { AttributeName: "maKhoaHoc", KeyType: "HASH"},  //Partition key
            ],
            Projection: {
                ProjectionType: 'ALL'
            },
            ProvisionedThroughput: {
                ReadCapacityUnits: 10,
                WriteCapacityUnits: 10
            }
        },
        {
            IndexName: 'index_ThuTu',
            KeySchema: [
                { AttributeName: "soThuTu", KeyType: "HASH"},  //Partition key
            ],
            Projection: {
                ProjectionType: 'ALL'
            },
            ProvisionedThroughput: {
                ReadCapacityUnits: 10,
                WriteCapacityUnits: 10
            }
        },
        {
            IndexName: 'index_BaiHoc',
            KeySchema: [
                { AttributeName: "maBaiHoc", KeyType: "HASH"},  //Partition key
            ],
            Projection: {
                ProjectionType: 'ALL'
            },
            ProvisionedThroughput: {
                ReadCapacityUnits: 10,
                WriteCapacityUnits: 10
            }
        },
        {
            IndexName: 'index_thongTinKiemDuyet',
            KeySchema: [
                { AttributeName: "maThongTinKiemDuyet", KeyType: "HASH"},  //Partition key
            ],
            Projection: {
                ProjectionType: 'ALL'
            },
            ProvisionedThroughput: {
                ReadCapacityUnits: 10,
                WriteCapacityUnits: 10
            }
        }
    ]
};

dynamodb.createTable(params, (err, data) => {
    if(err){
        console.error(`Something went wrong ${JSON.stringify(err,null,2)}`);
    }else{
        console.log(`Created table ${JSON.stringify(data, null, 2)}`);
    }
});