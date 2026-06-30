// Exchanges a Google OAuth authorization code for access + refresh tokens.
// Client Secret stays here, server-side, never sent to the browser.
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  try {
    const { code, redirectUri } = JSON.parse(event.body);
    if (!code || !redirectUri) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing code or redirectUri' }) };
    }

    const params = new URLSearchParams({
      code,
      client_id: process.env.GCAL_CLIENT_ID,
      client_secret: process.env.GCAL_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    });

    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });

    const data = await res.json();
    if (!res.ok) {
      return { statusCode: res.status, body: JSON.stringify(data) };
    }

    // data contains: access_token, refresh_token, expires_in, scope, token_type
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
