// import UserProfile from "@/entity/UserProfile";
import { injectable, inject } from "inversify";
// import TYPES from "@/config/types";
import { AppError } from "@/ErrorHandler/AppError";
import ConfigurationSchema from "@/entity/Configuration";

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

  public async getByID(id) {
    try {
      const config = await ConfigurationSchema.findById(id).lean();
      return await config;
    } catch (error) {
      throw new AppError("Error finding config", 400);
    }
  }
}

export interface ConfigurationService {
  //   create(account: Account, userParams): Promise<UserProfile>;
  create(config): Promise<any>;
  update(id, config): Promise<any>;
  getBySiteID(siteID: string): Promise<any>;
  getByCollectionID(collectionID: string): Promise<any>;
  getByID(id): Promise<any>;
  getAll(): Promise<any>;
}
