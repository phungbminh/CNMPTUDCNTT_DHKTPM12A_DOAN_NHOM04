
const aws = require('aws-sdk');
const fs = require('fs');
aws.config.update({
    region: 'us-east-1',
    accessKeyId: 'ASIAXORZEYKSYBNZG66K',
    secretAccessKey: 'hnxrXD6h/82NKrtJ5AjkLvQPROw3CdWl3MTRF3Mj',
    sessionToken: 'FQoGZXIvYXdzEK3//////////wEaDDQc5SHHlt4w2rfnjSKDAjpuwiUc5kF+YB73+rY5s7Y14nKS9QYfbcDIGpf+JBpp458uusNucd1On2VsgYp+VyB0iVwQyfYXbcD/XfB+ezLHH7vMo/zRBmBo5znuOmv6o+AQY9O48851hy3tojqHBaz56vYgeWvvUWNlULRKpz7DjTrWNRHRbhCSA4oxueLZ2lD/O+jcMjqHkxqaNZhkn7XMnsQ6ODMRj+IeZvXQ+yVCK8oqn9WkdJMdhWSW1W6yC3iPkNHMZaCMaBLR+clHvwUdLYwpOK+EZPi6+BdCUcLALDcpa9NAjmIEwIlYqMNUjX0Lnn8HXl0FS97Htfcsha7SQaxPoEQWTvW+/tH0h9tzPOQojtPg7QU=',
    endpoint: "http://dynamodb.us-east-1.amazonaws.com/"

});
var s3 = new aws.S3({
    region: 'us-east-1',
    accessKeyId: 'ASIAXORZEYKSYBNZG66K',
    secretAccessKey: 'hnxrXD6h/82NKrtJ5AjkLvQPROw3CdWl3MTRF3Mj',
    sessionToken: 'FQoGZXIvYXdzEK3//////////wEaDDQc5SHHlt4w2rfnjSKDAjpuwiUc5kF+YB73+rY5s7Y14nKS9QYfbcDIGpf+JBpp458uusNucd1On2VsgYp+VyB0iVwQyfYXbcD/XfB+ezLHH7vMo/zRBmBo5znuOmv6o+AQY9O48851hy3tojqHBaz56vYgeWvvUWNlULRKpz7DjTrWNRHRbhCSA4oxueLZ2lD/O+jcMjqHkxqaNZhkn7XMnsQ6ODMRj+IeZvXQ+yVCK8oqn9WkdJMdhWSW1W6yC3iPkNHMZaCMaBLR+clHvwUdLYwpOK+EZPi6+BdCUcLALDcpa9NAjmIEwIlYqMNUjX0Lnn8HXl0FS97Htfcsha7SQaxPoEQWTvW+/tH0h9tzPOQojtPg7QU=',
    endpoint: "http://s3.us-east-1.amazonaws.com/"
});

function themS3(file, name, url){

var buffer = fs.readFileSync(file.path);
var numPartsLeft = Math.ceil(buffer.length / partSize);
var maxUploadTries = 3;
var startTime = new Date();
var multipartMap = {
    Parts: []
};

var partNum = 0;
var partSize = 1024 * 1024 * 5; // 5mb chunks except last part

var multipartParams = {
    Bucket: 'doanbutket',
    Key: url + name,
    ContentType: file.type,
    ACL: 'public-read'
};
function completeMultipartUpload(s3, doneParams) {
    s3.completeMultipartUpload(doneParams, function (err, data) {
        if (err) return console.error('An error occurred while completing multipart upload');
        var delta = (new Date() - startTime) / 1000;
        console.log('Completed upload in', delta, 'seconds');
        console.log('Final upload data:', data);
    });
}

function uploadPart(s3, multipart, partParams, tryNum) {
    var tryNum = tryNum || 1;
    s3.uploadPart(partParams, function (multiErr, mData) {
        console.log('started');
        if (multiErr) {
            console.log('Upload part error:', multiErr);

            if (tryNum < maxUploadTries) {
                console.log('Retrying upload of part: #', partParams.PartNumber);
                uploadPart(s3, multipart, partParams, tryNum + 1);
            } else {
                console.log('Failed uploading part: #', partParams.PartNumber);
            }
            // return;
        }

        multipartMap.Parts[this.request.params.PartNumber - 1] = {
            ETag: mData.ETag,
            PartNumber: Number(this.request.params.PartNumber)
        };
        console.log('Completed part', this.request.params.PartNumber);
        console.log('mData', mData);
        if (--numPartsLeft > 0) return; // complete only when all parts uploaded

        var doneParams = {
            Bucket: multipartParams.Bucket,
            Key: multipartParams.Key,
            MultipartUpload: multipartMap,
            UploadId: multipart.UploadId
        };

        console.log('Completing upload...');
        completeMultipartUpload(s3, doneParams);
    }).on('httpUploadProgress', function (progress) { console.log(Math.round(progress.loaded / progress.total * 100) + '% done') });
}
console.log('Creating multipart upload for:', file.name);
s3.createMultipartUpload(multipartParams, function (mpErr, multipart) {
    if (mpErr) return console.error('Error!', mpErr);
    console.log('Got upload ID', multipart.UploadId);

    for (var start = 0; start < buffer.length; start += partSize) {
        partNum++;
        var end = Math.min(start + partSize, buffer.length);
        var partParams = {
            Body: buffer.slice(start, end),
            Bucket: multipartParams.Bucket,
            Key: multipartParams.Key,
            PartNumber: String(partNum),
            UploadId: multipart.UploadId
        };

        console.log('Uploading part: #', partParams.PartNumber, ', Start:', start);
        uploadPart(s3, multipart, partParams);
    }
});

}
module.exports = {
    themS3: themS3
}