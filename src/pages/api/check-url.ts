import type { APIRoute } from 'astro';

async function followRedirects(url, maxHops = 10) {
  const chain = [];
  const visited = new Set();
  let hops = 0;
  let currentUrl = url;

  while(hops < maxHops){
    // Detecting loop
    if(visited.has(currentUrl)){
      return buildResult(url, chain, maxHops, hops, true);
    }

    // Tracking urls
    visited.add(currentUrl);

    // Making request
    try {
      const response = await fetch(currentUrl, { method: 'HEAD', redirect: 'manual' } );
      const hop = {
        hop: hops + 1,
        url: currentUrl,
        status: response.status,
        statusText: response.statusText,
        redirectTo: null,
        headers: Object.fromEntries(response.headers)
      };
      const location = response.headers.get('location');

      // Detecting redirection
      if(location && response.status >= 300 && response.status < 400){
        hop.redirectTo = location;
        chain.push(hop);
        currentUrl = getURLToRedirect(location, currentUrl);
        hops++;
        continue;
      }

      chain.push(hop);
      break;
    } catch (error){
      chain.push(
        {
          hop: hops + 1,
          url: currentUrl,
          error: error?.message
        }
      );
      break;
    }
  }
  
  return buildResult(url, chain, maxHops, hops, false);
}

function buildResult(url, chain, maxHops, hops, loop) {
  return {
    inputUrl: url,
    redirectCount: Math.max(0, chain.length - 1),
    maxHops: maxHops,
    maxHopsReached: (hops >= maxHops),
    redirectLoopDetected: loop,
    final: chain[chain.length - 1] || null,
    chain: chain
  };
}

function getURLToRedirect(redirecTo, url){
  try{
    const newUrl = new URL(redirecTo, url);
    return newUrl.href;
  }catch(error){
    throw error;
  }
}

function isValidUrl(url){
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
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

    // 2. Starts following
    const result = await followRedirects(url);

    return new Response(
      JSON.stringify( { result } ),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch {
    return new Response(
      JSON.stringify({ error: 'Failed to check URL' }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};