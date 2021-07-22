import commonMiddleware from "../core/commonMiddleware";
import { createHeroService } from "../services/HeroServices";

async function createHeroHandler(event, context) {
  console.log("Records", event.Records);
  for (record in event.Records) {
    console.log("RECORD", record.dynamodb);
  }
  return {
    statusCode: 200,
    body: "Some Hero has changed",
  };
}

export const handler = commonMiddleware(createHeroHandler);
