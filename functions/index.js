exports.handler = async (event) => {
  const cityId = event.queryStringParameters.city || "1301";
  const provId = cityId.substring(0, 2);

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = String(now.getDate()).padStart(2, '0');

  // Official Bimas Islam Token
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
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Origin': 'https://bimasislam.kemenag.go.id',
        'Referer': 'https://bimasislam.kemenag.go.id/jadwalshalat',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                                 'X-Requested-With': 'XMLHttpRequest'
      }
    });

    const text = await response.text();

    // If Kemenag still sends a block page, we catch it here
    if (text.trim().startsWith("<!DOCTYPE html>") || text.trim().startsWith("<html")) {
      return {
        statusCode: 403,
        body: JSON.stringify({
          error: "Kemenag Firewall Blocked Netlify",
          solution: "Kemenag blocks foreign cloud IPs. Try refreshing or check back in a few minutes."
        })
      };
    }

    const result = JSON.parse(text);
    const todayKey = `${year}-${String(month).padStart(2, '0')}-${day}`;
    const todayData = result.data[todayKey];

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "Official Bimas Islam",
        tanggal: todayKey,
        jadwal: todayData
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Fetch Failed", message: error.message })
    };
  }
};
