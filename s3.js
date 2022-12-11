require("dotenv").config();
const fs = require("fs");
const crypto = require("crypto");
const sharp = require("sharp");
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const randomImageName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const client = new S3Client({
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
  region,
});

async function uploadFile(file) {
  const imageName = randomImageName();
  const buffer = await sharp(file.buffer)
    // .resize({ height: 800, width: 800, fit: "contain" })
    .resize({ width: 800 })
    .toBuffer();

  const uploadParams = {
    Bucket: bucketName,
    Key: imageName,
    Body: buffer,
    ContentType: file.mimetype,
  };

  const command = new PutObjectCommand(uploadParams);
  await client.send(command);
  return imageName;
}
exports.uploadFile = uploadFile;

async function getPresignedUrl(fileKey) {
  const getObjectParams = {
    Bucket: bucketName,
    Key: fileKey,
  };
  const command = new GetObjectCommand(getObjectParams);
  const url = await getSignedUrl(client, command, { expiresIn: 3600 });
  return url;
}
exports.getPresignedUrl = getPresignedUrl;

const deleteObject = async (fileKey) => {
  const params = { Bucket: bucketName, Key: fileKey };
  const command = new DeleteObjectCommand(params);
  const response = await client.send(command);
};

exports.deleteObject = deleteObject;
