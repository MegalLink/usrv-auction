import AWS from "aws-sdk";
import commonMiddleware from "../core/commonMiddleware";
import { getHeroService } from "../services/HeroServices";
async function getHeroHandler(event, context) {
  return await getHeroService(event);
}

export const handler = commonMiddleware(getHeroHandler);
