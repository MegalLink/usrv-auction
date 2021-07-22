import {
  getEndedHerosService,
  closeEndedHeroService,
} from "../services/HeroServices";
import createError from "http-errors";
async function scheduleHeroDeadHandler(event, context) {
  try {
    const herosToClose = await getEndedHerosService(event);
    console.log("HEROS_TO_CLOSE", herosToClose);
    const closePromisses = herosToClose.map((hero) =>
      closeEndedHeroService(hero)
    );
    await Promise.all(closePromisses);
    return {
      statusCode: 200,
      body: JSON.stringify({ closed: closePromisses.length }),
    };
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }
}
export const handler = scheduleHeroDeadHandler;
