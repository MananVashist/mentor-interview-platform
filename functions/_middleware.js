// functions/_middleware.js
// Cloudflare Pages Function for SPA routing

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const pathname = url.pathname;
  
  // Let static assets pass through
  if (
    pathname.startsWith('/_expo/') ||
    pathname.startsWith('/assets/') ||
    pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|webp|mp4|webm)$/i)
  ) {
    return context.next();
  }
  
  // For all other routes, serve index.html (SPA routing)
  try {
    const response = await context.env.ASSETS.fetch(
      new URL('/index.html', context.request.url)
    );
    return new Response(response.body, {
      status: 200,
      headers: response.headers
    });
  } catch (e) {
    return context.next();
  }
}
