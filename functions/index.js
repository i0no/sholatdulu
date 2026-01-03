exports.handler = async (event) => {
  const cityId = event.queryStringParameters.city || "1301";
  const now = new Date();

  // Manual date formatting to avoid needing date-fns
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  try {
    // We use globalThis.fetch to ensure compatibility
    const response = await fetch(
      `https://api.myquran.com/v2/sholat/jadwal/${cityId}/${year}/${month}/${day}`
    );

    if (!response.ok) {
      return { statusCode: response.status, body: "External API Error" };
    }

    const result = await response.json();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        lokasi: result.data.lokasi,
        jadwal: result.data.jadwal,
        serverTime: now.toISOString() // Built-in timestamp
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
