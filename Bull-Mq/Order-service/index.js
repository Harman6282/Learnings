import { Queue, QueueEvents } from "bullmq";
import express from "express";

const app = express();
app.use(express.json());

const verifyUser = new Queue("verification-queue");
const queueEvents = new QueueEvents("verification-queue");

queueEvents.on("completed", ({ returnvalue }) => {
  console.log("hellop");
  console.log("Is user verified: ", returnvalue);
});

app.post("/order", async (req, res) => {
  const { userId, productName } = req.body;

  const job = await verifyUser.add("verify user", { userId });

  res.json({ "jobId:": job.id });
});

app.listen(3000, () => {
  console.log("server running on port 3000");
});
