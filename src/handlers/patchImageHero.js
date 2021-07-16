import AWS from "aws-sdk";
import createError from "http-errors";
import commonMiddleware from "../core/commonMiddleware";
const dynamodb = new AWS.DynamoDB.DocumentClient();

async function patchImageHero(event, context) {
  const { id } = event.pathParameters;
  const { imageUrl } = event.body;
  if (!id) throw new createError.NotFound("id not found");
  if (!imageUrl) throw new createError.NotFound("Image url not found");
  const params = {
    TableName: process.env.HEROS_TABLE_NAME,
    Key: { id },
    UpdateExpression: "set imageUrl = :imageUrl",
    ExpressionAttributeValues: {
      ":imageUrl": imageUrl,
    },
    ReturnValues: "ALL_NEW",
  };
  let updatedHero;
  try {
    const result = await dynamodb.update(params).promise();
    updatedHero = result.Attributes;
  } catch (error) {
    throw new createError.InternalServerError(error);
  }
  return {
    statusCode: 200,
    body: JSON.stringify(updatedHero),
  };
}

export const handler = commonMiddleware(patchImageHero);
