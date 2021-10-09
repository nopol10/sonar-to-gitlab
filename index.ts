import express from "express";
import fs from "fs";
import { isValidSignature } from "./src/sonarqube";
import { SonarToGitlab } from "./src/gitlab";
import dotenv from "dotenv";
dotenv.config();

const stg = new SonarToGitlab();

async function start() {
  const app = express();

  app.use(
    express.json({
      verify: function (req, res, buf) {
        req["rawBody"] = buf;
      },
    })
  );

  /**
   * 1. Verify the signature of the request
   * 2. Process the report and send the comment to Gitlab
   */
  app.post("/", function (req, res) {
    const signatureKey = Object.keys(req.headers).find(
      (key) => key.toLowerCase() === "x-sonar-webhook-hmac-sha256"
    );
    if (!signatureKey) {
      res.status(400).send("Signature not found");
      return;
    }
    const signature: string = req.headers[signatureKey] as string;
    if (!isValidSignature(signature, req["rawBody"])) {
      res.status(401).send("Invalid signature");
      return;
    }

    stg.handleSonarqubeReport(req.body);
    res.send("Done");
  });

  console.log("Sonarcloud -> Gitlab listener started");

  app.listen(9040);
}

start();
