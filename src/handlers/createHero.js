import { v4 as uuid } from "uuid";
import AWS from "aws-sdk";
import commonMiddleware from "../core/commonMiddleware";
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
    imageUrl: "https://i.stack.imgur.com/l60Hf.png",
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

export const handler = commonMiddleware(createHero);
