import { Request, Response } from "express";
import { app, db, asyncHandler, upload, io, keycloak } from "../app";
import * as fs from "fs-extra";
import { handleEmail } from "./mail";

//Get all collaborators
app.get(
  "/api/collaborators",
  keycloak.protect(),
  asyncHandler(async (req: Request, res: Response, next: any) => {
    const cCollaborators = db.getCollection("collaborators");
    const docs = cCollaborators.find();
    return res
      .contentType("json")
      .status(200)
      .send(docs);
  })
);

//Get all collaborator avatars
app.get(
  "/api/collaborators/avatars",
  keycloak.protect(),
  asyncHandler(async (req: Request, res: Response, next: any) => {
    const cCollaborators = db.getCollection("collaborators");
    const docs = cCollaborators.find();
    var avatars: any = [];
    if (docs) {
      docs.forEach((e: any) => {
        if (e.file) {
          avatars.push({ email: e.email, avatar: e.file.filename });
        }
      });
    }
    return res
      .contentType("json")
      .status(200)
      .send(avatars);
  })
);

//Save collaborator
app.post(
  "/api/collaborators",
  keycloak.protect(),
  upload.single("avatar"),
  asyncHandler(async (req: Request, res: Response, next: any) => {
    const formFields = req.body;
    //validate email
    //console.log("File", req.file);
    //console.log("Form", formFields);
    const email = formFields.email;
    const cCollaborators = db.getCollection("collaborators");
    let cDoc = cCollaborators.findOne({ email });
    if (!cDoc) {
      let insertDoc = {
        email,
        responses: JSON.parse(formFields.userResponses),
        file: req.file
      };
      const doc = cCollaborators.insert(insertDoc);
      if (doc) {
        console.log("Successfully Saved");
        io.emit("c_avatars", { email: doc.email, avatar: doc.file.filename });
        handleEmail(doc);
        return res
          .contentType("json")
          .status(200)
          .send(doc);
      }
    } else {
      return res
        .contentType("json")
        .status(400)
        .send(`Collaborator with ${email} already exists`);
    }
  })
);

//Delete collaborator
app.delete(
  "/api/collaborators/:email",
  keycloak.protect(),
  asyncHandler(async (req: Request, res: Response, next: any) => {
    const email = req.params["email"];
    //console.log("Delete by email ", email);
    const cCollaborators = db.getCollection("collaborators");
    const doc = cCollaborators.findOne({ email });
    if (doc) {
      try {
        const fileName = doc.file.filename;
        //console.log("Delete Avatar File Name:", fileName);
        if (fileName) {
          await fs.remove(`${app.get("uploadsPath")}/${fileName}`);
        }
        cCollaborators.remove(doc);
        return res.status(204).send();
      } catch (err) {
        console.log("Error while delete", err);
        return res.status(500).send(err);
      }
    } else {
      return res.status(404).send(`No collaborator exists with email ${email}`);
    }
  })
);

//Delete collaborator
app.delete(
  "/api/collaborators",
  asyncHandler(async (req: Request, res: Response, next: any) => {
    const cCollaborators = db.getCollection("collaborators");
    cCollaborators.clear({ removeIndices: true });
    try {
      await fs.emptyDir(`${app.get("uploadsPath")}`);
    } catch (err) {
      console.log("Error while delete", err);
      return res.status(500).send(err);
    }
    return res.status(204).send();
  })
);
