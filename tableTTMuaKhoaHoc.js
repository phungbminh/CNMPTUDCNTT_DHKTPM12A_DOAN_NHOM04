const AWS = require('aws-sdk');
AWS.config.update({
    region: "local",
    endpoint: "http://localhost:8000"
});
let dynamodb = new AWS.DynamoDB();
var params = {
    TableName : "ThongTinMuaKhoaHoc",
    KeySchema: [
        { AttributeName: "maThanhVien", KeyType: "HASH"},
        { AttributeName: "maBaiHoc", KeyType: "RANGE"}

    ],
    AttributeDefinitions: [
        { AttributeName: "maThongTinMuaKhoaHoc", AttributeType: "N" },
        { AttributeName: "maBaiHoc", AttributeType: "N" },
        { AttributeName: "maThanhVien", AttributeType: "N" },
        { AttributeName: "maKhoaHoc", AttributeType: "N" }

   
    ],
   
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
    },
    GlobalSecondaryIndexes: [
        {
            IndexName: 'index_TTMuaKhoaHoc',
            KeySchema: [
                { AttributeName: "maThongTinMuaKhoaHoc", KeyType: "HASH"},  //Partition key
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