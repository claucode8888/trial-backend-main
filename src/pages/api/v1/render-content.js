import { experimental_AstroContainer } from 'astro/container';
import CardA from '@components/cards/CardA.astro';
import CtaB from '@components/cta/CtaB.astro';

export async function POST({ request }) {
  let body;
  // 1. Handle Json
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON.' }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" }
      }
    );
  }

  // 2. Validate data structure
  if(!Array.isArray(body.data)){
    return new Response(
      JSON.stringify(
        { error: 'Data must be an array.' }
      ),
      {
        status: 400,
        headers: { "Content-Type": "application/json" }
      }
    );
  }

  // 3. Main logic
  try {
    let cardsAFirstRow = '', cardsASecondRow = '', ctaBRow = '', contentData = '';
    const maxCardsFirstRow = 4;
    const container = await experimental_AstroContainer.create();

    // CardA Component
    const renderPromises = body.data.map(item =>
      container.renderToString(CardA, {
        props: {
          title: item?.title?.rendered ?? '',
          subtitle: item?.type ?? ''
        },
      })
    );
    const renderedCards = await Promise.all(renderPromises);

    // Setting card A rows content
    renderedCards.forEach((card, index) => {
      let divCol = `<div class="f--col-6">${card}</div>`;
      if (index < maxCardsFirstRow){
        cardsAFirstRow += divCol;
      } else {
        cardsASecondRow += divCol;
      }
    });

    // CtaB Component
    if(!body.loadMore){
      const CtaBComponent = await container.renderToString(CtaB);
      ctaBRow = `<div class="f--col-12">${CtaBComponent}</div>`;
    }

    // Setting final content
    contentData = cardsAFirstRow + ctaBRow + cardsASecondRow;
    
    return new Response(JSON.stringify({ contentData: contentData }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
  }catch (error) {
    console.error("Full error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error."}),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}