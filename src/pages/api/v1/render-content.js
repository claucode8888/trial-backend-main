import { experimental_AstroContainer } from 'astro/container';
import CardA from '@components/cards/CardA.astro';
import CtaB from '@components/cta/CtaB.astro';

export async function POST({ request }) {
  try {
    let cardsAFirstRow = '', cardsASecondRow = '', ctaBRow = '', contentData = '';
    const maxCardsFirstRow = 4;
    const { data = [], loadMore } = await request.json();
    const container = await experimental_AstroContainer.create();

    // CardA Component
    if (data.length) {
      const renderPromises = data.map(item => 
        container.renderToString(CardA, {
          props: { title: item.title.rendered, subtitle: item.type },
        })
      );
      const renderedCards = await Promise.all(renderPromises);

      // Setting rows content
      renderedCards.forEach((card, index) => {
        let divCol = `<div class="f--col-6">${card}</div>`;
        if (index < maxCardsFirstRow){
          cardsAFirstRow += divCol;
        } else {
          cardsASecondRow += divCol;
        }
      });
    }

    // CtaB Component
    if(!loadMore){
      const CtaBComponent = await container.renderToString(CtaB);
      ctaBRow = `<div class="f--col-12">${CtaBComponent}</div>`;
    }

    // Setting final content
    contentData = cardsAFirstRow + ctaBRow + cardsASecondRow;
    
    return new Response(JSON.stringify({ 'contentData': contentData }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  }catch (err) {
    console.error("Full error:", err);
    return new Response(
      JSON.stringify({ error: "Error", details: err.message }),
      { status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}