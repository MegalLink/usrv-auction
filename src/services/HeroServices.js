import { put, get, scan, update } from "../gateway/DynamoGateway";
import { v4 as uuid } from "uuid";
export async function getHeroService(event) {
  console.log("getHeroService init");
  const { id } = event.pathParameters;
  let hero = await get(process.env.HEROS_TABLE_NAME, id);
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
  let heros = await scan(process.env.HEROS_TABLE_NAME);
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
    endDate: endDate.toISOString(),
  };
  console.log(hero);
  await put(process.env.HEROS_TABLE_NAME, hero);
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
  let response = await update(
    process.env.HEROS_TABLE_NAME,
    id,
    "imageUrl",
    imageUrl
  );
  console.log(response);
  console.log("patchHeroService end");
  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
}

export async function getEndedHeros(event) {
  const now = new Date();
  const params = {
    TableName: process.env.HEROS_TABLE_NAME,
    IndexName: "",
  };
}
