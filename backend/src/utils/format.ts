import pickBy from "lodash/pickBy";
import { Document } from "mongoose";

export const pickPublicFields = (obj: Document) => {
  return pickBy(obj.toObject(), (value, key) => !key.startsWith(`_`));
};
