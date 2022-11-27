require("dotenv").config();
const fs = require("fs");
const crypto = require("crypto");
const sharp = require("sharp");
// const S3Client = require("aws-sdk/clients/s3");
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
// const DeleteObjectCommand = require("aws-sdk/clients/s3");
// import { DeleteObjectCommand } from "@aws-sdk/client-s3";
// import { s3Client } from "./libs/s3Client.js";

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
    .resize({ height: 800, width: 800, fit: "contain" })
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
  // const fileStream = fs.createReadStream(file.path);

  // return client.upload(uploadParams).promise();
}
exports.uploadFile = uploadFile;

// function uploadFile(file) {
//   const fileStream = fs.createReadStream(file.path);

//   const uploadParams = {
//     Bucket: bucketName,
//     Body: fileStream,
//     Key: file.filename,
//   };

//   return client.upload(uploadParams).promise();
// }
// exports.uploadFile = uploadFile;

async function getFileStream(fileKey) {
  const getObjectParams = {
    Bucket: bucketName,
    Key: fileKey,
  };
  const command = new GetObjectCommand(getObjectParams);
  const url = await getSignedUrl(client, command, { expiresIn: 3600 });
  console.log("url", url);
  return url;
}
exports.getFileStream = getFileStream;

// const getFileStream = async (fileKey) => {
//   const downloadParams = {
//     Key: fileKey,
//     Bucket: bucketName,
//   };
//   const command = new GetObjectCommand(downloadParams);
//   const response = await client.send(command);
//   // const response = client.getObject(downloadParams).createReadStream();
//   console.log("res", response);

//   // return client.getObject(downloadParams).createReadStream();
// };
// exports.getFileStream = getFileStream;

const deleteObject = async (fileKey) => {
  const params = { Bucket: bucketName, Key: fileKey };
  const command = new DeleteObjectCommand(params);
  const response = await client.send(command);
  console.log("res", response);
  // return client.send(command);
};

exports.deleteObject = deleteObject;
