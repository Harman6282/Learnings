import express from "express";
import {
  getSignedUrl,
  S3RequestPresigner,
} from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { ProductModel } from "./product-model";
import { connectToDB } from "./db";
import cors from 'cors'

const app = express();
app.use(express.json());

app.use(cors())

await connectToDB()

// initialize s3 client
const client = new S3Client({
  region: "us-east-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const createPresignedUrlWithoutClient = async ({ bucket, key }) => {
  const command = new PutObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(client, command, { expiresIn: 3600 });
};

app.get("/api/products", async (req, res) => {
    const products = await ProductModel.find();
    res.json(products)
})

app.get("/", (req, res) => {
  res.send("hello from bun js");
});

app.post("/get-presigned-url", async (req, res) => {
  console.log(req.body)
  const { mime } = req.body;

  const filename = uuidv4();

  const finalName = `${filename}.${mime}`;
  const url = await createPresignedUrlWithoutClient({
    bucket: process.env.S3_BUCKET_NAME,
    key: finalName,
  });

  res.json({ url, finalname: finalName });
});

app.post("/api/products", async (req, res) => {
  const {name, description, price, filename} = req.body
  
  if(!name || !description || !price || !filename){
    res.json({"message": "all fields are required"})
    return 
  }

  const product = await ProductModel.create({
    name,
    description,
    price,
    filename
  })




  res.json({"message": "success"})
})

app.listen(8080, () => {
  
  console.log("server started at port 8080");
});
