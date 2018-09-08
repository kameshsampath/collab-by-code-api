import env from "dotenv";
if (process.env.NODE_ENV === "development") {
  env.config();
}

import * as cors from "cors";
import express from "express";
import * as http from "http";
import * as https from "https";
import * as fs from "fs";
import bodyParser from "body-parser";
import multer from "multer";
//import * as chokidar from "chokidar";
import { loadData } from "./utils/collectionUtils";

import loki from "lokijs";
import lfsa from "lokijs/src/loki-fs-structured-adapter";

export const log = console.log.bind(console);

//Set up express
export const app = express();

let webServer;
if (process.env.NODE_ENV != "development") {
  const sslOpts = {
    key: fs.readFileSync("/etc/svccerts/tls.key"),
    cert: fs.readFileSync("/etc/svccerts/tls.crt")
  };
  webServer = https.createServer(sslOpts, app);
  app.set("port", 8443);
} else {
  webServer = new http.Server(app);
  app.set("port", process.env.PORT || 8080);
}

app.set("ip", process.env.IP || process.env.OPENSHIFT_NODEJS_IP || "0.0.0.0");

//DB Config
app.set("dbPath", process.env.DB_PATH || "/tmp");
app.set("dbName", process.env.DB_NAME || "eventdb.json");
app.set("uploadsPath", process.env.UPLOADS_PATH || "/tmp/uploads");

//DB Init
export const upload = multer({
  dest: `${app.get("uploadsPath")}`
});

log("Using DB", `${app.get("dbPath")}/${app.get("dbName")}`);
const lokiFsStructAdapter = new lfsa();
export const db = new loki(`${app.get("dbPath")}${app.get("dbName")}`, {
  adapter: lokiFsStructAdapter,
  autoload: true,
  autoloadCallback: databaseInitialize,
  autosave: true,
  autosaveInterval: 4000
});

function databaseInitialize() {
  let data = require("./data/questions_data.json");
  let collectionName = "questions";
  let collection;
  collection =
    db.getCollection(collectionName) || db.addCollection(collectionName);
  loadData(collection, data)
    .then((s: string) => {
      log("Successfully Loaded default questions");
    })
    .catch((err: any) => log("Error loading data", err));

  collectionName = "frames";
  data = require("./data/frame_data.json");
  collection =
    db.getCollection(collectionName) || db.addCollection(collectionName);
  loadData(collection, data)
    .then((s: string) => {
      log("Successfully Loaded default Frames");
    })
    .catch((err: any) => console.log("Error loading Frames data", err));

  db.getCollection("collaborators") || db.addCollection("collaborators");
}

//Middlware
app.use(cors.default({ origin: "*" }));
app.use("/avatars", express.static(app.get("uploadsPath")));
app.use(bodyParser.json());

export const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

//Questions routes
import "./api/questions";

//Frames routes
import "./api/frames";

//Collaborator routes
import "./api/collaborators";

export const io = require("socket.io")(webServer);

io.on("connection", (socket: any) => {});

//Start the server
webServer.listen(app.get("port"), () => {
  log(
    "\n  App is running at https://localhost:%d in %s mode.",
    app.get("port"),
    app.get("env")
  );
  log("\n  Press CTRL-C to stop\n");
});
