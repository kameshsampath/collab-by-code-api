import { Request, Response } from "express";
import { app, db, asyncHandler, upload, io, keycloak } from "../app";

const GITHUB_GIST_BASE_URL = "https://gist.github.com";

const axios = require("axios");
const https = require("https");

let githubInstance = axios.create({
  baseURL: "https://gist.github.com",
  httpsAgent: new https.Agent()
});

app.get(
  "/api/gist/:id",
  keycloak.protect(),
  asyncHandler(async (req: Request, res: Response, next: any) => {
    const gistId = req.params["id"];
    if (gistId) {
      //console.log("Gist id:", gistId);
      const gistRes = await githubInstance.get(`/${gistId}.json`);
      //const.log("Gist Response",gistRes);
      const gistDiv = gistRes.data.div;
      return res.status(200).send(gistDiv);
    } else {
      return res.status(404).send("No Gist Id passed");
    }
  })
);
