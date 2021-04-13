import { injectable, inject } from "inversify";
import TYPES from "../config/types";
import { Redis } from "ioredis";
import { AppError } from "@/ErrorHandler/AppError";
import { CustomResponse } from "@/ErrorHandler/CustomResponse";
const Webflow = require("webflow-api");

@injectable()
export class WebflowServiceImpl implements WebflowService {
  private redisClient: Redis;

  private accessToken: string;

  constructor(@inject(TYPES.Redis) redisClient: Redis) {
    this.redisClient = redisClient;
    this.accessToken =
      "92a04629d06d49f71a07bddb709dbade2bfe8d5a7010047f23116abe41f88b7a";
  }

  public async listSites(token = this.accessToken) {
    return await webflowClient(token).sites();
  }

  public async getSite(token = this.accessToken, siteId) {}

  public async getSiteDomains(token = this.accessToken, siteId) {
    return await webflowClient(token)
      .domains({ siteId })
      .then((res) => console.log("domains", res));
  }

  public async listCollections(token = this.accessToken, siteId) {
    return await webflowClient(token).collections({ siteId });
  }

  public async getCollection(token = this.accessToken, collectionId) {
    return await webflowClient(token).collection({ collectionId });
  }

  public async getCollectionItems(token = this.accessToken, collectionId) {
    const identifier = "items-" + collectionId;
    const cachedItems = await this.redisClient.get(identifier);

    if (cachedItems) return JSON.parse(cachedItems);

    const { items, total }: CollectionItems = await webflowClient(token).items({
      collectionId,
    });

    if (total <= 100) {
      this.redisClient.setex(identifier, 5 * 60, JSON.stringify(items));
      return items;
    }

    const offsets = Math.ceil(total / 100) - 1;

    const results: Array<DelayedCollectionItems> = await Promise.allSettled(
      Array(offsets)
        .fill(0)
        .map((v, i) => {
          return webflowClient(token).items(
            { collectionId },
            { offset: (i + 1) * 100 }
          );
        })
    );

    const collectionItems = results.reduce((acc, { status, value }) => {
      if (status == "fulfilled") {
        const { items } = value;
        return acc.concat(items);
      }
      return acc;
    }, items);

    this.redisClient.setex(identifier, 4 * 60, JSON.stringify(collectionItems));

    return collectionItems;
  }
}

export interface WebflowService {
  listSites(token: string);
  getSite(token: string, siteId: string);
  getSiteDomains(token: string, siteId: string);
  listCollections(token: string, siteId: string);
  getCollection(token: string, collectionId: string);
  getCollectionItems(token: string, collectionId: string);
}

interface CollectionItems {
  items: Array<object>;
  count: number;
  limit: number;
  offset: number;
  total: number;
}

interface DelayedCollectionItems {
  status: string;
  value?: CollectionItems;
  reason?: any;
}

const webflowClient = (token: string) => {
  return new Webflow({ token });
};
