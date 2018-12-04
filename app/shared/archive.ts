import * as firebase from "firebase-admin";

import { Archive } from "./models/archive";

export async function all(): Promise<Archive[]> {
  const archives: Archive[] = [];
  const collection = await firebase.firestore()
    .collection("archives")
    .where("count", ">", 0)
    .get();
  collection.forEach(archive => archives.push(archive.data() as Archive));

  return archives.sort((a, b) => a.date > b.date ? -1 : (a.date < b.date ? 1 : 0));
}