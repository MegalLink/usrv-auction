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

  //Estos datos de detail type y source son importantes por que con eso podemos crear la regla para el
  // even bride algo asi "source":["mi-usrv"],"detail-type":["object"] sino mandamos object entonces no lo caputa al evento
  console.log("EventBridgeGateway Entries", params);
  try {
    return await eventBridge.putEvents(params).promise();
  } catch (error) {
    console.error("EventBridgeGatewayError", error);
    throw new createError.InternalServerError(error);
  }
}
