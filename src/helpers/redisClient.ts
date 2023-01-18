import { createClient } from "redis";
import { logger } from "./logger";

const DEFAULT_EXPIRATION = 604800000;

export const redisClient = createClient();
if (process.env["NODE_ENV"] === "development") {
} else {
}

redisClient.on("error", (err: any) => console.log("Redis Client Error", err));

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

export const setRedis = async (
  key: string,
  freshData: any,
  expireTime?: number,
) => {
  try {
    if (expireTime) {
      await redisClient.set(key, JSON.stringify(freshData), {
        EX: expireTime,
      });
    }
    await redisClient.set(key, JSON.stringify(freshData));
  } catch (error) {
    logger.log({
      level: "error",
      message: `Set Redis error: ${
        typeof error === "object" ? JSON.stringify(error) : error
      }`,
    });
  }
};

export const getRedis = async (key: string) => {
  try {
    const data = await redisClient.get(key);
    return data && JSON.parse(data);
  } catch (error) {
    logger.log({
      level: "error",
      message: `Get Redis error: ${
        typeof error === "object" ? JSON.stringify(error) : error
      }`,
    });
    return null;
  }
};

export const setRedisHash = async (
  key: string,
  field: string,
  freshData: any,
) => {
  try {
    const setRedis = await redisClient.hSet(
      key,
      field,
      JSON.stringify(freshData),
    );
    console.log("Set RedisHash", setRedis);
  } catch (error) {
    logger.log({
      level: "error",
      message: `Set RedisHash error: ${
        typeof error === "object" ? JSON.stringify(error) : error
      }`,
    });
  }
};

export const getRedisHash = async (key: string, field: string) => {
  try {
    const data = await redisClient.hGet(key, field);
    return data && JSON.parse(data);
  } catch (error) {
    logger.log({
      level: "error",
      message: `Set RedisHash error: ${
        typeof error === "object" ? JSON.stringify(error) : error
      }`,
    });
  }
};
