import commonMiddleware from "../core/commonMiddleware";
import { syncHeroService } from "../services/SyncService";
async function syncHeroHandler(event, context) {
  console.log("SyncHeroHandler");
  const result = await syncHeroService(event);
  if (result) {
    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  }
}

export const handler = commonMiddleware(syncHeroHandler);
