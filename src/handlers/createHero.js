import { v4 as uuid } from "uuid";
import AWS from "aws-sdk";
import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpEventNormalizer from "@middy/http-event-normalizer";
import httpErrorHandler from "@middy/http-error-handler";
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createHero(event, context) {
  //Event and lambda is provided by AWS when lambda is called
  const { heroName, superPower } = event.body;
  const now = new Date();
  const hero = {
    id: uuid(),
    heroName,
    superPower,
    status: "OPEN",
    createdAt: now.toISOString(),
  };
  console.log(hero);
  try {
    await dynamodb
      .put({
        TableName: process.env.HEROS_TABLE_NAME,
        Item: hero,
      })
      .promise();
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(hero),
  };
}

export const handler = middy(createHero)
  .use(httpJsonBodyParser()) //gets the body from the event and converts the body into an object
  .use(httpEventNormalizer()) // Normalizes HTTP events by adding an empty object for queryStringParameters
  .use(httpErrorHandler()); //Creates a proper HTTP response for errors that are created with the http-errors module and represents proper HTTP errors

//  format string without middy  {"body":" {\"heroName\": \"Jeff\", \"superPower\": \"Coding\"}"}
// format json with middy   {"body":{"heroName":"Jeff","superPower":"codding"}}
