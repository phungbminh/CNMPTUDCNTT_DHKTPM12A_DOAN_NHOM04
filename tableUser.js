const AWS = require('aws-sdk');
AWS.config.update({
    region: "local",
    endpoint: "http://localhost:8000"
});
let dynamodb = new AWS.DynamoDB();
var params = {
    TableName : "User",
    KeySchema: [
        { AttributeName: "maTaiKhoan", KeyType: "HASH"},  //Partition key
    ],
    AttributeDefinitions: [
        { AttributeName: "maTaiKhoan", AttributeType: "N" },
        { AttributeName: "tenTaiKhoan", AttributeType: "S" },
        { AttributeName: "matKhau", AttributeType: "S" },
        { AttributeName: "tenThanhVien", AttributeType: "S" },
        { AttributeName: "loaiTaiKhoan", AttributeType: "S" },
        { AttributeName: "maThanhVien", AttributeType: "N" },

    ],
   
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
    },
    GlobalSecondaryIndexes: [
        {
            IndexName: 'index_TaiKhoan',
            KeySchema: [
                { AttributeName: "tenTaiKhoan", KeyType: "HASH"},  //Partition key
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
            IndexName: 'index_MatKhau',
            KeySchema: [
                { AttributeName: "matKhau", KeyType: "HASH"},  //Partition key
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
            IndexName: 'index_TenThanhVien',
            KeySchema: [
                { AttributeName: "tenThanhVien", KeyType: "HASH"},  //Partition key
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
            IndexName: 'index_LoaiTaiKhoan',
            KeySchema: [
                { AttributeName: "loaiTaiKhoan", KeyType: "HASH"},  //Partition key
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
            IndexName: 'index_maThanhVien',
            KeySchema: [
                { AttributeName: "maThanhVien", KeyType: "HASH"},  //Partition key
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