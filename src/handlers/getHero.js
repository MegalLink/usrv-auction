import AWS from "aws-sdk";
import createError from "http-errors";
import commonMiddleware from "../core/commonMiddleware";
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

export const handler = commonMiddleware(getHero);
