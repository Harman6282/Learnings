import express from "express";

const app = express();

app.get("/", (req, res) => {
    res.json("hello ")
})


app.listen(3003, () => {
  console.log("server running on port 3003");
});
