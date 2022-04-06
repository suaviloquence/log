import fs from "fs/promises";

import express from "express";
import bodyParser from "body-parser";

import * as dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(bodyParser.urlencoded());
app.use("/", express.static("static"));

const LOG_DIR = process.env.LOG_DIR;

function fileName(): string {
  const date = new Date();

  function pad(n: number, len: number = 2): string {
    return n.toString().padStart(len, "0");
  }

  return `${LOG_DIR}/${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}.md`;
}

interface LogReq {
  message: string;
}

app.post<never, never, LogReq>("/api/log", async (req, res) => {
  const { message } = req.body;
  if (typeof message !== "string") return res.sendStatus(400);

  try {
    await fs.appendFile(fileName(), `- ${message}\n`);
  } catch (e) {
    console.error(`Error writing "${message}" to ${fileName()}: ${e}`);
  }

  res.redirect("/");
});

const PORT = process.env.PORT ?? 1536;
app.listen(PORT, () => {
  console.log(`Listening on 0.0.0.0:${PORT}`);
});
