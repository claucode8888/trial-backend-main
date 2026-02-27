export async function POST({ request }) {
    const container = await experimental_AstroContainer.create();
    const { data = []} = await request.json();
    
    try {
        const module = await import(`{path-to-card.astro}`);
        const Component = module.default;
        const result = await container.renderToString(Component, {
            props: {
                data: data,
            },
        });

        return new Response(JSON.stringify({ result }), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: `Error`, details: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
}