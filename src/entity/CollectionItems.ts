import { CollectionItemsDto } from "@/Dto/CollectionItemsDto";
import { Schema, model, SchemaTypes, Document } from "mongoose";

const CollectionItemsSchema = new Schema<CollectionItemsDto>(
  {
    created: { type: Date, default: Date.now },
    collectionID: { type: String, unique: true },
    items: [SchemaTypes.Mixed],
  },
  {
    timestamps: true,
  }
);

export default model<CollectionItemsDto & Document>(
  "CollectionItems",
  CollectionItemsSchema
);
