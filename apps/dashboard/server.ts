import { Request, Response } from "express";
import { manifest } from "./pwa";
import express from "express";
import path from "path";
import fs from "fs";
import { config } from "dotenv";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require(
  path.join(__dirname, "..", "..", "..", "package.json"),
);
config();

const app = express();
const indexPath = path.join(__dirname, "", "index.html");

const envVars = {
  VITE_NODE_ENV: process.env.VITE_NODE_ENV || "production",
  VITE_WHITE_ENV: process.env.VITE_WHITE_ENV || "prod",
  VITE_G_MAPS:
    process.env.VITE_G_MAPS || "AIzaSyCF3iTH5nJBsdJMxzXeg208RS1Ab_yuE6E",
};

app.get("/version", (_, res) => res.status(200).send(version));

app.get("/manifest.json", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  res.send(
    JSON.stringify(
      manifest(envVars.VITE_WHITE_ENV === "preprod" ? "PreProd" : undefined),
    ),
  );
});

app.get("/icons/l192.png", (req: Request, res: Response) => {
  const imagePath = path.join(
    __dirname,
    "/icons",
    envVars.VITE_WHITE_ENV === "prod" ? "" : `/${envVars.VITE_WHITE_ENV}`,
    "/l192.png",
  );
  res.sendFile(imagePath, (err) => {
    if (err) {
      console.log(err);
      res.status(404).send("Image not found");
    }
  });
});

app.get("/icons/l512.png", (req: Request, res: Response) => {
  const imagePath = path.join(
    __dirname,
    "/icons",
    envVars.VITE_WHITE_ENV === "prod" ? "" : `/${envVars.VITE_WHITE_ENV}`,
    "/l512.png",
  );
  res.sendFile(imagePath, (err) => {
    if (err) {
      console.log(err);
      res.status(404).send("Image not found");
    }
  });
});

app.use(express.static(path.join(__dirname, ""), { index: false }));

app.get("*", (req: Request, res: Response) => {
  fs.readFile(indexPath, "utf8", (err: any, htmlData: any) => {
    if (err) {
      console.log("Error during file reading", err);
      return res.status(500).end();
    }

    const envVariables = JSON.stringify(envVars);

    const finalHtml = htmlData.replace("%ENV_VARIABLES%", envVariables);

    res.send(finalHtml);
  });
});

const port = 4100;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port}`);
});
