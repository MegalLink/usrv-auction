import commonMiddleware from "../core/commonMiddleware";
import { createHeroService } from "../services/HeroServices";

async function createHeroHandler(event, context) {
  return await createHeroService(event);
}

export const handler = commonMiddleware(createHeroHandler);
