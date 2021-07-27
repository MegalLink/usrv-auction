import AWS from "aws-sdk";
import createError from "http-errors";
const eventBridge = new AWS.EventBridge();
export async function putEvent(detail, eventBusName, source, detailType) {
  console.log("EventBridgeGateway | Detail", JSON.stringify(detail));
  const params = {
    Entries: [
      {
        Detail: JSON.stringify(detail),
        DetailType: detailType,
        EventBusName: eventBusName,
        Source: source,
      },
    ],
  };
  console.log("EventBridgeGateway Entries", params);
  try {
    return await eventBridge.putEvents(params).promise();
  } catch (error) {
    console.error("EventBridgeGatewayError", error);
    throw new createError.InternalServerError(error);
  }
}
