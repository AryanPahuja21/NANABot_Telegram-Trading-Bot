import express from "express";

const app = express();
const PORT = 3000;

app.get("/", (_req, res) => {
  res.send("Welcome to NANABot Server!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
