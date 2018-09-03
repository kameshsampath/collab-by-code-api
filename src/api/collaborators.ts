import { Request, Response } from "express";
import { app, db, upload, io, log } from "../app";
import { loadCollection } from "../utils/collectionUtils";
import * as fs from "fs-extra";

//Get all collaborators
app.get(
  "/api/collaborators",
  async (req: Request, res: Response, next: any) => {
    //TODO move this to higher order function
    try {
      const cCollaborators = await loadCollection("collaborators", db);
      const docs = cCollaborators.find();
      if (docs) {
        return res
          .contentType("json")
          .status(200)
          .send(docs);
      }
    } catch (err) {
      res.status(404).send(err);
    }
  }
);

//Get all collaborator avatars
app.get(
  "/api/collaborators/avatars",
  async (req: Request, res: Response, next: any) => {
    //TODO move this to higher order function
    try {
      const cCollaborators = await loadCollection("collaborators", db);
      const docs = cCollaborators.find();
      var avatars: any = [];
      if (docs) {
        docs.forEach((e: any) => {
          avatars.push({ email: e.email, avatar: e.file.filename });
        });
      }
      return res
        .contentType("json")
        .status(200)
        .send(avatars);
    } catch (err) {
      res.status(404).send(err);
    }
  }
);

//Save collaborator
app.post(
  "/api/collaborators",
  upload.single("avatar"),
  async (req: Request, res: Response, next: any) => {
    try {
      const formFields = req.body;
      //console.log("File", req.file);
      // console.log("Form", formField);
      const cCollaborators = await loadCollection("collaborators", db);
      let insertDoc = {
        email: formFields.email,
        responses: JSON.parse(formFields.userRespones),
        file: req.file
      };
      const doc = cCollaborators.insert(insertDoc);
      if (doc) {
        return res
          .contentType("json")
          .status(200)
          .send(doc);
      }
    } catch (err) {
      res.status(404).send(err);
    }
  }
);

//Delete collaborator
app.delete(
  "/api/collaborators/:email",
  async (req: Request, res: Response, next: any) => {
    //TODO move this to higher order function
    const email = req.params["email"];
    //console.log("Delete by email ", email);
    try {
      const cCollaborators = await loadCollection("collaborators", db);
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
        return res
          .status(404)
          .send(`No collaborator exists with email ${email}`);
      }
    } catch (err) {
      res.status(404).send(err);
    }
  }
);

//Delete collaborator
app.delete(
  "/api/collaborators",
  async (req: Request, res: Response, next: any) => {
    //console.log("Deleting all ");
    try {
      const cCollaborators = await loadCollection("collaborators", db);
      cCollaborators.clear({ removeIndices: true });
      try {
        await fs.emptyDir(`${app.get("uploadsPath")}`);
      } catch (err) {
        console.log("Error while delete", err);
        return res.status(500).send(err);
      }
      return res.status(204).send();
    } catch (err) {
      res.status(404).send(err);
    }
  }
);
