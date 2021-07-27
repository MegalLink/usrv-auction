import { putEvent } from "../gateway/EventBridgeGateway";
import createError from "http-errors";
export async function syncHeroService(event) {
  console.log("syncHeroService init");
  console.log("EVENT RECORDS", event.Records);
  if (event.Records.length !== 0) {
    for (let record of event.Records) {
      console.log("RECORD NEWIMAGE", record.dynamodb.NewImage);

      try {
        const detail = {
          action: record.eventName,
          mappingType: "dynamo",
          originUsrv: process.env.USRV_NAME,
          payload: record.dynamodb.NewImage,
        };
        //Para poder ver esta regla en el eventBridge hay que configurar una regla desde consola
        const result = await putEvent(
          detail,
          process.env.HEROS_EVENT_BUS_NAME,
          process.env.USRV_NAME,
          "object"
        );
        console.log("syncService | putEvent | result:", result.$response);
        console.log("syncHeroService end");
        return result;
      } catch (error) {
        console.error(error);
        throw new createError.InternalServerError(error);
      }
    }
  }
}
