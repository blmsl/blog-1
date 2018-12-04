import * as functions from "firebase-functions";
import { difference } from "lodash";

import { Entry } from "../shared/models/entry";
import { decrementArchiveCount, incrementArchiveCount } from "../utils/aggregation/archive";
import { decrementCategoryCount, incrementCategoryCount } from "../utils/aggregation/category";

module.exports = functions.runWith({
  memory: "256MB",
  timeoutSeconds: 30
}).firestore.document("entries/{entryId}").onUpdate(async (change) => {
  const before = change.before.data() as Entry;
  const after = change.after.data() as Entry;

  // archive
  if (before.created_at._seconds !== after.created_at._seconds) {
    await decrementArchiveCount(new Date(before.created_at._seconds));
    await incrementArchiveCount(new Date(after.created_at._seconds));
  }

  // category
  // before にあって after にないもの
  {
    const diff = difference(before.categories, after.categories);
    for (let category of diff) {
      await decrementCategoryCount(category);
    }
  }

  // after にあって、 before にないもの
  {
    const diff = difference(after.categories, before.categories);
    for (let category of diff) {
      await incrementCategoryCount(category);
    }
  }
});