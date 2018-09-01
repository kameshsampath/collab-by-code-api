import env from "dotenv";
env.config();

import * as cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import { loadData } from "./utils/collectionUtils";

import loki from "lokijs";
import lfsa from "lokijs/src/loki-fs-structured-adapter";

//Set up express
export const app = express();
app.set("port", process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.set("ip", process.env.IP || process.env.OPENSHIFT_NODEJS_IP || "0.0.0.0");

//DB Config
app.set("dbPath", process.env.DB_PATH || "/tmp");
app.set("dbName", process.env.DB_NAME || "eventdb");
app.set("uploadsPath", process.env.UPLOADS_PATH || "/tmp/uploads");

//DB Init
export const upload = multer({
  dest: `${app.get("uploadsPath")}`
});

console.log("Using DB", `${app.get("dbPath")}${app.get("dbName")}`);
const lokiFsStructAdapter = new lfsa();
export const db = new loki(`${app.get("dbPath")}${app.get("dbName")}`, {
  adapter: lokiFsStructAdapter,
  autoload: true,
  autoloadCallback: databaseInitialize,
  autosave: true,
  autosaveInterval: 4000
});

function databaseInitialize() {
  let collectionName = "questions";
  let collection = db.getCollection(collectionName);
  let data = require("./data/questions_data.json");
  collection =
    db.getCollection(collectionName) || db.addCollection(collectionName);
  loadData(collection, data)
    .then((s: string) => {
      console.log("Successfully Loaded default questions");
    })
    .catch((err: any) => console.log("Error loading data", err));

  collectionName = "frames";
  data = require("./data/frame_data.json");
  collection =
    db.getCollection(collectionName) || db.addCollection(collectionName);
  loadData(collection, data)
    .then((s: string) => {
      console.log("Successfully Loaded default Frames");
    })
    .catch((err: any) => console.log("Error loading Frames data", err));

  db.getCollection("collaborators") || db.addCollection("collaborators");
}

//Middlware
app.use(cors.default({ origin: "*" }));
app.use(bodyParser.json());

//Questions routes
import "./api/questions";

//Frames routes
import "./api/frames";

//Collaborator routes
import "./api/collaborators";

//Start the server
app.listen(app.get("port"), () => {
  console.log(
    "\n  App is running at http://localhost:%d in %s mode.",
    app.get("port"),
    app.get("env")
  );
  console.log("\n  Press CTRL-C to stop\n");
});
