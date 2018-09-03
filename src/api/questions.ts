import { Request, Response } from "express";
import { app, db, asyncHandler } from "../app";
import { loadCollection } from "../utils/collectionUtils";

//Get all questions
app.get(
  "/api/questions",
  asyncHandler(async (req: Request, res: Response, next: any) => {
    const qCollection = await loadCollection("questions", db);
    const docs = qCollection.find();
    return res
      .contentType("json")
      .status(200)
      .send(docs);
  })
);
