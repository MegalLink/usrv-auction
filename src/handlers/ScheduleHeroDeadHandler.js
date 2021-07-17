import { getEndedHerosService } from "../services/HeroServices";
async function scheduleHeroDeadHandler(event, context) {
  console.log("scheduleHeroDead");

  return await getEndedHerosService(event);
}
export const handler = scheduleHeroDeadHandler;
