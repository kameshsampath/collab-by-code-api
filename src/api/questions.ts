import { Request, Response } from "express";
import { app, db } from "../app";
import { loadCollection } from "../utils/collectionUtils";

//Get all questions
app.get("/api/questions", async (req: Request, res: Response, next: any) => {
  //TODO move this to higher order function
  try {
    const qCollection = await loadCollection("questions", db);
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
