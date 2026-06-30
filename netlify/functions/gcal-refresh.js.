// Exchanges a stored refresh_token for a fresh access_token.
// Called automatically whenever the app's saved token is expired or about to expire.
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  try {
    const { refreshToken } = JSON.parse(event.body);
    if (!refreshToken) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing refreshToken' }) };
    }

    const params = new URLSearchParams({
      refresh_token: refreshToken,
      client_id: process.env.GCAL_CLIENT_ID,
      client_secret: process.env.GCAL_CLIENT_SECRET,
      grant_type: 'refresh_token'
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

    // data contains: access_token, expires_in, scope, token_type
    // Note: refresh_token is NOT returned again on refresh calls â€” the original one stays valid and reusable.
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
