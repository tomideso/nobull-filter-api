import { inject, injectable } from "inversify";
import { AppError } from "@/ErrorHandler/AppError";
import CollectionItemsSchema from "@/entity/CollectionItems";
import { CollectionItemsDto } from "@/Dto/CollectionItemsDto";
import { Redis } from "ioredis";
import TYPES from "@/config/types";

@injectable()
export class CollectionItemsServiceImpl implements CollectionItemsService {
  private redisClient;

  constructor(@inject(TYPES.Redis) redisClient: Redis) {
    this.redisClient = redisClient;
  }

  public async createOrUpdate(collectionID, items) {
    try {
      return await CollectionItemsSchema.findOneAndUpdate(
        { collectionID },
        { collectionID, items },
        {
          new: true,
          upsert: true,
        }
      );
    } catch (error) {
      throw new AppError(error, 400);
    }
  }

  public async getByCollectionID(CollectionID) {
    const identifier = "items-" + CollectionID;

    try {
      const { items }: CollectionItemsDto = await CollectionItemsSchema.findOne(
        {
          CollectionID,
        }
      ).lean();

      this.redisClient.setex(identifier, 4 * 60, JSON.stringify(items));

      return await items;
    } catch (error) {
      throw new AppError("Error finding config", 400);
    }
  }
}

export interface CollectionItemsService {
  createOrUpdate(collectionID, items): Promise<CollectionItemsDto>;
  getByCollectionID(collectionID: string): Promise<any>;
}
