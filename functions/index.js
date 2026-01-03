const { format } = require('date-fns');

exports.handler = async (event) => {
  // Get city from URL query or default to Jakarta (1301)
  const cityId = event.queryStringParameters.city || "1301";

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  try {
    const response = await fetch(
      `https://api.myquran.com/v2/sholat/jadwal/${cityId}/${year}/${month}/${day}`
    );
    const result = await response.json();

    if (!result.status) throw new Error("API Error");

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        lokasi: result.data.lokasi,
        daerah: result.data.daerah,
        jadwal: result.data.jadwal,
        serverTime: format(now, 'HH:mm:ss')
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Gagal mengambil data jadwal" })
    };
  }
};
