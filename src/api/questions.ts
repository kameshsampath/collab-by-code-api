import { Request, Response } from "express";
import { app, db, asyncHandler, keycloak } from "../app";

//Get all questions
app.get(
  "/api/questions",
  keycloak.protect(),
  asyncHandler(async (req: Request, res: Response, next: any) => {
    const qCollection = db.getCollection("questions");
    const docs = qCollection.find();
    return res
      .contentType("json")
      .status(200)
      .send(docs);
  })
);
