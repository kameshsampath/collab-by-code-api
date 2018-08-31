import { Request, Response } from "express";
import { app, db } from "../app";
import { loadCollection } from "../utils/collectionUtils";

//Get all frames
app.get("/api/frames", async (req: Request, res: Response, next: any) => {
  //TODO move this to higher order function
  try {
    const qCollection = await loadCollection("frames", db);
    const docs = qCollection.find();
    if (docs) {
      return res
        .contentType("json")
        .status(200)
        .send(docs);
    }
  } catch (err) {
    res.status(404).send(err);
  }
});

//Load Frames
app.post("/api/frames", async (req: Request, res: Response, next: any) => {
  //TODO move this to higher order function
  let frames = req.body;
  try {
    const cFrame = await loadCollection("frames", db);
    if (frames) {
      frames.forEach((f: any) => {
        cFrame.insert(f);
      });
      return res
        .contentType("json")
        .status(200)
        .send(frames);
    }
  } catch (err) {
    res.status(404).send(err);
  }
});

//Get one Frame by Id
app.get("/api/frames/:id", async (req: Request, res: Response, next: any) => {
  let id = req.params["id"];
  console.log("Searching Frame by id = ", id);
  //TODO move this to higher order function
  try {
    const framesCollection = await loadCollection("frames", db);
    const doc: any = framesCollection.findOne({ id: id });
    console.log("Got Frame to Doc ", doc);
    if (doc) {
      return res
        .contentType("json")
        .status(200)
        .send(doc);
    }
  } catch (err) {
    res.status(404).send(`No Frame with id ${id} found`);
  }
});
//Update Frame Data
app.patch("/api/frames/:id", async (req: Request, res: Response, next: any) => {
  let id = req.params["id"];
  //console.log("Updating Frame by id = ", id);
  let updatedDoc = req.body;
  //console.log("Doc to be updated ", updatedDoc);
  //TODO move this to higher order function
  try {
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
    }
  } catch (err) {
    console.log(err);
    res.status(404).send(`No Frame with id ${id} found`);
  }
});
