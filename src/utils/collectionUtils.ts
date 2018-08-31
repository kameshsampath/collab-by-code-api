import * as fs from "fs";
import { db } from "../app";
import { Collection } from "lokijs";

export async function loadData(collection: any, docs: any) {
  return new Promise((resolve, reject) => {
    if (docs) {
      collection.clear();
      docs.forEach((q: any) => {
        collection.insert(q);
      });
      resolve("success");
    }
  });
}

export function loadCollection(collectionName: string, db: Loki) {
  return new Promise<Collection>(resolve => {
    db.loadDatabase({}, () => {
      const collection =
        db.getCollection(collectionName) || db.addCollection(collectionName);
      resolve(collection);
    });
  });
}
