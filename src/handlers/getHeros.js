import AWS from "aws-sdk";
import commonMiddleware from "../core/commonMiddleware";
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

export const handler = commonMiddleware(getHeros);
