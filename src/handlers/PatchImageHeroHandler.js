import commonMiddleware from "../core/commonMiddleware";
import { patchHeroService } from "../services/HeroServices";

async function patchImageHeroHandler(event, context) {
  return await patchHeroService(event);
}

export const handler = commonMiddleware(patchImageHeroHandler);
