import * as firebase from "firebase-admin";

import { Entries, Entry } from "./models/entry";

export async function show(year: number, month: number, slug: string): Promise<Entry> {
  const collection = await firebase.firestore()
    .collection("entries")
    .where("created_at", ">=", new Date(year, month - 1))
    .where("created_at", "<", new Date(year, month))
    .where("slug", "==", slug)
    .limit(1)
    .get();
  return collection.docs.shift().data() as Entry;
}

export async function list(offset: number): Promise<Entries> {
  const entries: Entry[] = [];
  const collection = await firebase.firestore()
    .collection("entries")
    .orderBy("created_at", "desc")
    .limit(6)
    .offset(offset * 5)
    .get();
  collection.forEach(entry => entries.push(entry.data() as Entry));

  return {
    entries: entries.slice(0, 5),
    offset,
    hasPrev: offset > 0,
    hasNext: entries.length > 5
  } as Entries;
}

export async function latest(): Promise<Entry[]> {
  const entries: Entry[] = [];
  const collection = await firebase.firestore()
    .collection("entries")
    .orderBy("created_at", "desc")
    .limit(5)
    .get();
  collection.forEach(entry => {
    entries.push(entry.data() as Entry);
  });

  return entries;
}