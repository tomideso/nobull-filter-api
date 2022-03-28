import { ConfigurationDto } from "@/Dto/ConfigurationDto";
import { Schema, model, Document } from "mongoose";

const ConfigurationSchema = new Schema<ConfigurationDto>(
  {
    created: { type: Date, default: Date.now },
    account: {
      type: Schema.Types.ObjectId,
      ref: String,
      required: false,
    },

    siteID: String,
    site: {
      shortName: String,
      previewUrl: String,
      name: String,
    },
    filters: [
      {
        collectionID: String,
        activeClassName: { type: String, default: "active" },
        name: String,

        groups: [
          {
            name: String,
            filterOption: String,
            trigger: String,
            elements: [
              {
                trigger: String,
                filterBy: String,
                filterByAlias: String,
                collectionItem: String,
                collectionItemRefSlug: String,
                collectionItemRefID: String,
                logicRules: [
                  {
                    operator: String,
                    value: String,
                    joiner: String,
                    field: String,
                    fieldType: String,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

export default model<ConfigurationDto & Document>(
  "Configuration",
  ConfigurationSchema
);
