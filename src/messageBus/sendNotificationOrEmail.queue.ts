import { messageBusType, messageSendNotificationOrEmail } from "@app/constants";
import { IMessage, sendQueueMessage } from "./publisher";
interface IMessageData {
  // "type"// EMAIL, APP_NOTIFICATION
  type: string;
  templateKey: string;
  params?: object;
  tokens?: object;
  receivingAccountId?: string;
  receivingEmailAddress?: string;
  cultureCode?: string;
}
export const sendNotificationOrEmail = async (messageData: IMessageData) => {
  try {
    // console.log("messageData", messageData);
    await sendQueueMessage({
      type: "noti_message",
      // messageData?.type === messageSendNotificationOrEmail.NOTIFICATION
      //   ? messageSendNotificationOrEmail.NOTIFICATION
      //   : messageSendNotificationOrEmail.EMAIL,
      data: messageData,
    });
    // console.log("send noti to queue");
  } catch (err) {
    console.log("queue err", err);
  }
};
