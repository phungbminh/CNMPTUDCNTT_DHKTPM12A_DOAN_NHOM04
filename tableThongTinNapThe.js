const AWS = require('aws-sdk');
AWS.config.update({
    region: "local",
    endpoint: "http://localhost:8000"
});
let dynamodb = new AWS.DynamoDB();
var params = {
    TableName : "ThongTinNapThe",
    KeySchema: [
        { AttributeName: "maTaiKhoan", KeyType: "HASH"}
    

    ],
    AttributeDefinitions: [
        { AttributeName: "maTaiKhoan", AttributeType: "N" },
        { AttributeName: "maThongTinNapThe", AttributeType: "N" },
        { AttributeName: "maTheCao", AttributeType: "S" }
    ],
   
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
    },
    GlobalSecondaryIndexes: [
        {
            IndexName: 'index_TaiKhoan',
            KeySchema: [
                { AttributeName: "maTaiKhoan", KeyType: "HASH"},  //Partition key
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
            IndexName: 'index_ThongTinNapThe',
            KeySchema: [
                { AttributeName: "maThongTinNapThe", KeyType: "HASH"},  //Partition key
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
            IndexName: 'index_TheCao',
            KeySchema: [
                { AttributeName: "maTheCao", KeyType: "HASH"},  //Partition key
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