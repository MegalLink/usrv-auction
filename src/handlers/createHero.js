import { v4 as uuid } from "uuid";
import AWS from "aws-sdk";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createHero(event, context) {
  //Event and lambda is provided by AWS when lambda is called
  const { heroName, superPower } = JSON.parse(event.body);
  const now = new Date();
  const hero = {
    id: uuid(),
    heroName,
    superPower,
    status: "OPEN",
    createdAt: now.toISOString(),
  };

  await dynamodb
    .put({
      TableName: "HerosTable",
      Item: hero,
    })
    .promise();

  return {
    statusCode: 201,
    body: JSON.stringify(hero),
  };
}

export const handler = createHero;
