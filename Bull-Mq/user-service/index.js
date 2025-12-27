import express from "express";
import { Queue, Worker } from "bullmq";

const app = express();

const db = [
  {
    id: 99,
  },
];

const connection = {
  host: "127.0.0.1",
  port: 6379,
};

const verification_Worker = new Worker(
  "verification-queue",
  (job) => {
    const userId = job.data.userId;
    console.log(`job recieved from user ${userId}`);

    const isVerified = db.some((user) => user.id === userId);

    return isVerified;
  },

  {connection}
);

app.listen(3002, () => {
  console.log("server running on port 3002");
});
