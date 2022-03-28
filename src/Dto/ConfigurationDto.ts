import { Document } from "mongoose";
import { AccountDto } from "./AccountDto";

export interface ConfigurationDto {
  created: Date;
  siteID: string;
  filters: Array<Filter>;
  site: Site;
  account: string | AccountDto;
}

type Group = {
  name: string;
  filterOption: string;
  trigger: string;
  elements: [
    {
      trigger: string;
      filterBy: string;
      filterByAlias: string;
      collectionItem: string;
      collectionItemRefSlug: string;
      collectionItemRefID: string;
      logicRules: [
        {
          operator: string;
          value: string;
          joiner: string;
          field: string;
          fieldType: string;
        }
      ];
    }
  ];
};

type Filter = {
  collectionID: string;
  activeClassName: string;
  name: String;
  groups: Array<Group>;
};

type Site = {
  shortName: string;
  previewUrl: string;
  name: string;
};
