import AWS from "aws-sdk";
import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpEventNormalizer from "@middy/http-event-normalizer";
import httpErrorHandler from "@middy/http-error-handler";
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getHeros(event, context) {
  let heros;
  try {
    const result = await dynamodb
      .scan({ TableName: process.env.HEROS_TABLE_NAME })
      .promise();
    heros = result.Items;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(heros),
  };
}

export const handler = middy(getHeros)
  .use(httpJsonBodyParser()) //gets the body from the event and converts the body into an object
  .use(httpEventNormalizer()) // Normalizes HTTP events by adding an empty object for queryStringParameters
  .use(httpErrorHandler()); //Creates a proper HTTP response for errors that are created with the http-errors module and represents proper HTTP errors

//  format string without middy  {"body":" {\"heroName\": \"Jeff\", \"superPower\": \"Coding\"}"}
// format json with middy   {"body":{"heroName":"Jeff","superPower":"codding"}}
