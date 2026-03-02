import { experimental_AstroContainer } from 'astro/container';
import CardA from '@components/cards/CardA.astro';
import CtaB from '@components/cta/CtaB.astro';

export async function POST({ request }) {
  try {
    let contentData = { 'cardsAFirstRow': '', 'ctaBRow': '', 'cardsASecondRow': '' };
    const maxCardsFirstRow = 3;
    const { data = [], ctab } = await request.json();
    const container = await experimental_AstroContainer.create();

    // CardA Component
    if (data.length) {
      const renderPromises = data.map(item => 
        container.renderToString(CardA, {
          props: {
            title: item.title.rendered,
            subtitle: item.type,
          },
        })
      );
      const renderedCards = await Promise.all(renderPromises);

      renderedCards.forEach((card, index) => {
        let divCol = `<div class="f--col-6">${card}</div>`;
        if (index <= maxCardsFirstRow){
          contentData.cardsAFirstRow += divCol;
        } else {
          contentData.cardsASecondRow += divCol;
        }
      });
    }

    // CtaB Component
    if(ctab){
      const CtaBComponent = await container.renderToString(CtaB);
      contentData.ctaBRow = `<div class="f--col-12">${CtaBComponent}</div>`;
    }

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