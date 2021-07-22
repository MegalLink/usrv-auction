import {
  dynamoPut,
  dynamoGet,
  dynamoScan,
  dynamoUpdate,
  dynamoQuery,
} from "../gateway/DynamoGateway";
import { v4 as uuid } from "uuid";
export async function getHeroService(event) {
  console.log("getHeroService init");
  const { id } = event.pathParameters;
  let hero = await dynamoGet(process.env.HEROS_TABLE_NAME, id);
  if (!hero) {
    throw new createError.NotFound(`Hero with id ${id} not found`);
  }
  console.log("getHeroService end");
  return {
    statusCode: 200,
    body: JSON.stringify(hero),
  };
}
export async function getHerosService(event) {
  console.log("getHerosService init");
  let heros = await dynamoScan(process.env.HEROS_TABLE_NAME);
  console.log("getHerosService end");
  return {
    statusCode: 200,
    body: JSON.stringify(heros),
  };
}
export async function createHeroService(event) {
  console.log("createHeroService init");
  const { heroName, superPower } = event.body;
  const now = new Date();
  const endDate = new Date();
  endDate.setHours(now.getHours() + 1);
  const hero = {
    id: uuid(),
    heroName,
    superPower,
    imageUrl: "https://i.stack.imgur.com/l60Hf.png",
    status: "OPEN",
    isAlive: true,
    createdAt: now.toISOString(),
    endingAt: endDate.toISOString(),
  };
  console.log(hero);
  await dynamoPut(process.env.HEROS_TABLE_NAME, hero);
  console.log("createHeroService end");
  return {
    statusCode: 201,
    body: JSON.stringify(hero),
  };
}
export async function patchHeroService(event) {
  console.log("patchHeroService init");
  const { id } = event.pathParameters;
  const { imageUrl } = event.body;
  if (!id) throw new createError.NotFound("id not found");
  if (!imageUrl) throw new createError.NotFound("Image url not found");
  const params = {
    TableName: process.env.HEROS_TABLE_NAME,
    Key: { id },
    UpdateExpression: `set imageUrl = :value`,
    ExpressionAttributeValues: {
      ":value": imageUrl,
    },
    ReturnValues: "ALL_NEW",
  };

  await dynamoUpdate(params);

  let hero = await dynamoGet(process.env.HEROS_TABLE_NAME, id);
  console.log("patchHeroService end");
  return {
    statusCode: 200,
    body: JSON.stringify(hero),
  };
}

export async function getEndedHerosService(event) {
  console.log("getEndedHeros init");
  const now = new Date();
  const params = {
    TableName: process.env.HEROS_TABLE_NAME,
    IndexName: "statusAndEndDate",
    //We send #status with # because is reserved word see endingAt is not necesary to write #
    KeyConditionExpression: "#status = :status AND endingAt <= :now",
    ExpressionAttributeValues: {
      ":status": "OPEN",
      ":now": now.toISOString(),
    },
    ExpressionAttributeNames: {
      "#status": "status",
    },
  };
  return await dynamoQuery(params);
}

export async function closeEndedHeroService(hero) {
  const params = {
    TableName: process.env.HEROS_TABLE_NAME,
    Key: { id: hero.id },
    UpdateExpression: "set #status = :status",
    ExpressionAttributeValues: {
      ":status": "CLOSED",
    },
    ExpressionAttributeNames: {
      "#status": "status",
    },
  };
  return await dynamoUpdate(params);
}
