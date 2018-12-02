import * as cors from "cors";
import * as express from "express";
import * as firebase from "firebase-admin";
import * as functions from 'firebase-functions';

firebase.initializeApp();
firebase.firestore().settings({
  timestampsInSnapshots: true
});

const app = express();

const corsConfig: cors.CorsOptions = {
  origin: "*",
  maxAge: 36000,
  credentials: true
};

app.options("*", cors(corsConfig));

app.get("/api/entries", cors(corsConfig), async (req, res) => {
  const entries = [];
  const collection = await firebase.firestore()
    .collection("entries")
    .orderBy("created_at", "desc")
    .limit(21)
    .get();
  collection.forEach(entry => {
    entries.push(entry.data());
  });

  res.set("Cache-Control", "public, max-age=60, s-maxage=300");
  res.status(200).send({
    entries,
    hasNext: entries.length > 20,
  });

  return;
});

app.get("/api/entries/:yyyy/:mm/:slug", cors(corsConfig), async (req, res) => {
  let entry: any = null;
  const collection = await firebase.firestore()
    .collection("entries")
    .where("created_at", ">=", new Date(req.params.yyyy, req.params.mm - 1))
    .where("created_at", "<", new Date(req.params.yyyy, req.params.mm))
    .where("slug", "==", req.params.slug)
    .limit(1)
    .get();

  collection.forEach(w => {
    entry = w.data();
  });

  res.set("Cache-Control", "public, max-age=60, s-maxage=300");
  res.status(200).send(entry);
  return;
});

export const api = functions.runWith({
  memory: "256MB",
  timeoutSeconds: 10
}).https.onRequest(app);