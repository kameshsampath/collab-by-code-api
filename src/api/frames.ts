import { Request, Response } from "express";
import { app, db, asyncHandler, keycloak } from "../app";
import { loadCollection } from "../utils/collectionUtils";

//Get all frames
app.get(
  "/api/frames",
  keycloak.protect(),
  asyncHandler(async (req: Request, res: Response, next: any) => {
    const cFrames = await loadCollection("frames", db);
    const docs = cFrames.find();
    return res
      .contentType("json")
      .status(200)
      .send(docs);
  })
);

//Load Frames
app.post(
  "/api/frames",
  keycloak.protect(),
  asyncHandler(async (req: Request, res: Response, next: any) => {
    let frames = req.body;
    const cFrames = await loadCollection("frames", db);
    if (cFrames) {
      frames.forEach((f: any) => {
        cFrames.insert(f);
      });
      return res
        .contentType("json")
        .status(200)
        .send(frames);
    }
  })
);

//Get one Frame by Id
app.get(
  "/api/frames/:id",
  keycloak.protect(),
  asyncHandler(async (req: Request, res: Response, next: any) => {
    let id = req.params["id"];
    console.log("Searching Frame by id = ", id);
    const framesCollection = await loadCollection("frames", db);
    const doc: any = framesCollection.findOne({ id: id });
    console.log("Got Frame to Doc ", doc);
    if (doc) {
      return res
        .contentType("json")
        .status(200)
        .send(doc);
    } else {
      throw new Error(`No Frame with id ${id} found`);
    }
  })
);
//Update Frame Data
app.patch(
  "/api/frames/:id",
  keycloak.protect(),
  asyncHandler(async (req: Request, res: Response, next: any) => {
    let id = req.params["id"];
    //console.log("Updating Frame by id = ", id);
    let updatedDoc = req.body;
    //console.log("Doc to be updated ", updatedDoc);
    const framesCollection = await loadCollection("frames", db);
    const doc: any = framesCollection.findOne({ id });
    //console.log("Got Frame to update ", doc);
    if (doc) {
      Object.assign(doc, updatedDoc);
      //console.log("Updated Doc ", doc);
      framesCollection.update(doc);
      return res
        .contentType("json")
        .status(200)
        .send(updatedDoc);
    } else {
      throw new Error(`No Frame with id ${id} found`);
    }
  })
);
