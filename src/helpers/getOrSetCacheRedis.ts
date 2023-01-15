import { createClient } from "redis";
import { logger } from "./logger";

const DEFAULT_EXPIRATION = 604800000;

let redisClient = createClient();
if (process.env["NODE_ENV"] === "development") {
} else {
}

redisClient.on("error", err => console.log("Redis Client Error", err));

redisClient.connect();

export const getOrSetCacheRedis = async (key: string, callBackFunc?: any) => {
  try {
    const data = await redisClient.get(key);
    if (!!data) {
      return JSON.parse(data);
      // return data;
    } else {
      const freshData = await callBackFunc();
      await redisClient.set(key, JSON.stringify(freshData), {
        EX: DEFAULT_EXPIRATION,
      });
      return freshData;
    }
  } catch (error) {
    logger.log({
      level: "error",
      message: `Get Or Set Cache Redis error: ${
        typeof error === "object" ? JSON.stringify(error) : error
      }`,
    });
    return null;
  }
};

export const setCacheRedis = async (
  key: string,
  freshData: any,
  expireTime?: number,
) => {
  try {
    await redisClient.set(key, JSON.stringify(freshData), {
      EX: expireTime ?? DEFAULT_EXPIRATION,
    });
    // console.log("Set Redis", setRedis);
  } catch (error) {
    logger.log({
      level: "error",
      message: `Set Redis error: ${
        typeof error === "object" ? JSON.stringify(error) : error
      }`,
    });
  }
};

export const getRedisMiddleware = async (key: string) => {
  try {
    const data = await redisClient.get(key);
    return data;
  } catch (error) {
    logger.log({
      level: "error",
      message: `Get Redis Middleware error: ${
        typeof error === "object" ? JSON.stringify(error) : error
      }`,
    });
    return null;
  }
};
