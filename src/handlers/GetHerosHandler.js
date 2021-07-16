import AWS from "aws-sdk";
import commonMiddleware from "../core/commonMiddleware";
import { getHerosService } from "../services/HeroServices";

async function getHerosHandler(event, context) {
  return await getHerosService(event);
}

export const handler = commonMiddleware(getHerosHandler);
