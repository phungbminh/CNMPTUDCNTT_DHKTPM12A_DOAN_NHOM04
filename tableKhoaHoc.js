const AWS = require('aws-sdk');
AWS.config.update({
    region: "local",
    endpoint: "http://localhost:8000"
});
let dynamodb = new AWS.DynamoDB();
var params = {
    TableName : "KhoaHoc",
    KeySchema: [
        { AttributeName: "maThanhVien", KeyType: "HASH"},  //Partition key
        { AttributeName: "maBaiHoc", KeyType: "RANGE" },  //Sort key
    ],
    AttributeDefinitions: [
        { AttributeName: "maThanhVien", AttributeType: "N" },
        { AttributeName: "maBaiHoc", AttributeType: "N" },
        { AttributeName: "maKhoaHoc", AttributeType: "N" },
        { AttributeName: "maThongTinKiemDuyet", AttributeType: "N" },
       
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