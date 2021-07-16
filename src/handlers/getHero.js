import AWS from "aws-sdk";
import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpEventNormalizer from "@middy/http-event-normalizer";
import httpErrorHandler from "@middy/http-error-handler";
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getHero(event, context) {
  const { id } = event.pathParameters;
  let hero;
  try {
    const result = await dynamodb
      .get({ TableName: process.env.HEROS_TABLE_NAME, Key: { id } })
      .promise();
    hero = result.Item;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }
  if (!hero) {
    throw new createError.NotFound(`Hero with id ${id} not found`);
  }
  return {
    statusCode: 200,
    body: JSON.stringify(hero),
  };
}

export const handler = middy(getHero)
  .use(httpJsonBodyParser()) //gets the body from the event and converts the body into an object
  .use(httpEventNormalizer()) // Normalizes HTTP events by adding an empty object for queryStringParameters
  .use(httpErrorHandler()); //Creates a proper HTTP response for errors that are created with the http-errors module and represents proper HTTP errors

//  format string without middy  {"body":" {\"heroName\": \"Jeff\", \"superPower\": \"Coding\"}"}
// format json with middy   {"body":{"heroName":"Jeff","superPower":"codding"}}
