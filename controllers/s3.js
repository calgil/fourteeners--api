import aws from 'aws-skd';
import dotenv from 'dotenv';
import { randomBytes } from 'crypto';
// import { promisify } 

dotenv.config();

const region = 'us-west-2';
const bucketName = 'fourteeners';
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

const s3 = new aws.S3({
    region,
    accessKeyId,
    secretAccessKey,
    signatureVersion: 'v4'
})

export async function generateUploadUrl() {
    const rawBytes = randomBytes(16);
    const imageName = rawBytes.toString('hex');

    const params = ({
        Bucket: bucketName,
        Key: imageName,
        Expires: 60
    })

    const uploadURL = await s3.getSignedUrlPromise('putObject', params);
    return uploadURL;
}