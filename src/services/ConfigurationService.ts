// import UserProfile from "@/entity/UserProfile";
import { injectable, inject } from "inversify";
// import TYPES from "@/config/types";
import { AppError } from "@/ErrorHandler/AppError";
import ConfigurationSchema from "@/entity/Configuration";
import { ConfigurationDto } from "@/Dto/ConfigurationDto";

@injectable()
export class ConfigurationServiceImpl implements ConfigurationService {
  public async create(config) {
    try {
      const configuration = new ConfigurationSchema();
      Object.assign(configuration, config);

      return await configuration.save();
    } catch (error) {
      throw new AppError(error, 400);
    }
  }

  public async update(id, config) {
    const { _id, ...rest } = config;
    try {
      const saved = await ConfigurationSchema.findByIdAndUpdate(id, rest, {
        new: true,
      });

      return saved;
    } catch (error) {
      throw new AppError(error, 400);
    }
  }

  public async getAll() {
    try {
      const config = await ConfigurationSchema.find().lean();
      return await config;
    } catch (error) {
      throw new AppError("Error finding config", 400);
    }
  }

  public async getBySiteID(siteID) {
    try {
      const config = await ConfigurationSchema.findOne({ siteID }).lean();
      return await config;
    } catch (error) {
      throw new AppError("Error finding config", 400);
    }
  }

  public async getByCollectionID(CollectionID) {
    try {
      const config = await ConfigurationSchema.findOne({ CollectionID }).lean();
      return await config;
    } catch (error) {
      throw new AppError("Error finding config", 400);
    }
  }

  public async updateActiveClassName(_id, { classname, collectionID }) {
    try {
      const config: any = await this.getByID(_id);

      const filterIdx = config.filters.findIndex(
        (val) => val.collectionID == collectionID
      );

      config.filters[filterIdx].activeClassName = classname;
      console.log(classname);

      return await ConfigurationSchema.findByIdAndUpdate(
        _id,
        {
          $set: config,
        },
        { new: true }
      ).lean();
    } catch (error) {
      throw new AppError("Error updating classname", 400);
    }
  }

  public async getByID(id) {
    try {
      const config = await ConfigurationSchema.findById(id).lean();
      if (!config) {
        throw new AppError("Error finding config", 400);
      }
      return await config;
    } catch (error) {
      throw new AppError("Error finding config", 400);
    }
  }

  public async publish(configID, filterName) {
    try {
      const config = await ConfigurationSchema.findById(configID).lean();
    } catch (error) {
      throw new AppError("Error finding config", 400);
    }
  }
}

export interface ConfigurationService {
  //   create(account: Account, userParams): Promise<UserProfile>;
  create(config): Promise<ConfigurationDto>;
  update(id, config): Promise<ConfigurationDto>;
  updateActiveClassName(id: string, reqBody: classnameReq);
  getBySiteID(siteID: string): Promise<ConfigurationDto>;
  getByCollectionID(collectionID: string): Promise<ConfigurationDto>;
  getByID(id): Promise<any>;
  publish(configID, filterName);
  getAll(): Promise<any>;
}

type classnameReq = {
  classname: string;
  collectionID: string;
};
