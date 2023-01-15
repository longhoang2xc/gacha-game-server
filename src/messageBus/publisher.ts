import { messageBusType } from "@app/constants";
import { logger } from "@app/helpers";
const amqplib = require("amqplib");

var connection;
export interface IMessage<T> {
  type: string;
  data: T;
}

export const sendQueueMessage = async (messageData: IMessage<any>) => {
  const { data, type } = messageData;
  try {
    const connection = await amqplib.connect(process.env.RABBIT_MQ_IP);
    const channel = await connection.createChannel();
    await channel.assertQueue(type);
    channel.sendToQueue(type, Buffer.from(JSON.stringify(data)), {
      persistent: true,
    });
  } catch (err) {
    console.log("err", err);
    logger.log({
      level: "error",
      message: `Send Queue Message error: ${err + JSON.stringify(err)}`,
    });
  }
};
