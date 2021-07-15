async function createHero(event, context) { //Event and lambda is provided by AWS when lambda is called
  const {heroName,superPower} =JSON.parse(event.body)
  const now=new Date();
  const auction={
    heroName,
    superPower,
    status:'OPEN',
    createdAt:now.toISOString(),
  }
  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
}

export const handler = createHero;



