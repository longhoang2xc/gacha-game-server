import { messageBusType } from "@app/constants";
import { transferCollateralsContractOnTimeConsumer } from "./transferCollateralsContractOnTime.queue";
let amqp = require('amqplib/callback_api');
var connection;

export const consumerConnect = async () => {
  try {
  }
  catch (err) {
    console.error(err);
  }
}
