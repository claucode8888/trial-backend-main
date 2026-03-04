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
async function followRedirects(url){
}

export const POST: APIRoute = async ({ request }) => {
  let url;
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

  url = body.url;

  // 2. URL Validation
  if (!isValidUrl(url)){
    return new Response(
      JSON.stringify({ error: 'Invalid url' }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" }
      }
    );
  }

  // 3. Making request
  try {
    const result = await followRedirects(url);

    return new Response(
      JSON.stringify(result),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to check URL' }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};