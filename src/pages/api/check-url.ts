import type { APIRoute } from 'astro';

function isValidUrl(url){
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Main logic 
async function followRedirects(initialUrl){
}

export const POST: APIRoute = async ({ request }) => {

  try {
    const body = await request.json();
    const url = body.url;

    //URL Validation
    if (!isValidUrl(url)){
      return new Response(
        JSON.stringify({ error: 'Invalid URL' }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 2. Making request
    const result = await followRedirects(url);

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch {
    return new Response(
      JSON.stringify({ error: 'Failed to check URL' }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};