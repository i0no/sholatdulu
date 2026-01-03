exports.handler = async (event) => {
  const cityId = event.queryStringParameters.city || "1301";
  const provId = cityId.substring(0, 2);

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  // Token used by official Kemenag website
  const KEMENAG_TOKEN = "af7c667b9819378c0bddb3baede9525b";

  try {
    const params = new URLSearchParams();
    params.append('param_prov', provId);
    params.append('param_kabko', cityId);
    params.append('param_thn', year);
    params.append('param_bln', month);
    params.append('param_token', KEMENAG_TOKEN);

    const response = await fetch('https://bimasislam.kemenag.go.id/apiv1/getShalatJadwal', {
      method: 'POST',
      body: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                                 'Referer': 'https://bimasislam.kemenag.go.id/jadwalshalat'
      }
    });

    const result = await response.json();
    const todayKey = `${year}-${String(month).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const todayData = result.data[todayKey];

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tanggal: todayKey,
        jadwal: todayData
      })
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: "Kemenag Timeout" }) };
  }
};
