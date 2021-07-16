async function scheduleHeroDead(event, context) {
  console.log("scheduleHeroDead");
  return {
    statusCode: 200,
    body: JSON.stringify({ isDead: true }),
  };
}
export const handler = scheduleHeroDead;
