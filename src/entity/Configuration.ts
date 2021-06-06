import { Schema, model } from "mongoose";

const ConfigurationSchema = new Schema({
  created: { type: Date, default: Date.now },
  account: {
    type: Schema.Types.ObjectId,
    ref: String,
    required: false,
  },
  siteID: String,
  site: {},
  collectionID: String,
  domain: String,
  imageUrl: String,
  filters: [
    {
      collectionID: String,
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
              logicRules: [
                {
                  operator: String,
                  value: String,
                  joiner: String,
                  field: String,
                  fieldType: String,
                },
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
});

export default model("Configuration", ConfigurationSchema);
