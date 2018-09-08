import { Request, Response } from "express";
import { app, db, asyncHandler } from "../app";

//Get all questions
app.get(
  "/api/questions",
  asyncHandler(async (req: Request, res: Response, next: any) => {
    const qCollection = db.getCollection("questions");
    const docs = qCollection.find();
    return res
      .contentType("json")
      .status(200)
      .send(docs);
  })
);
