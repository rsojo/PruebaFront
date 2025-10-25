import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');
  const latParam = searchParams.get('lat');
  const lonParam = searchParams.get('lon');

  // Validación básica de entrada: requiere city o lat/lon
  if ((!city || !city.trim()) && (!latParam || !lonParam)) {
    return NextResponse.json({ error: 'Provee "city" o "lat" y "lon"' }, { status: 400 });
  }

  // Modo mock opcional para desarrollo/demo
  if (process.env.WEATHER_MOCK === '1') {
    return NextResponse.json({
      city: city?.trim() || `${latParam},${lonParam}`,
      country: 'XX',
      tempC: 22.5,
      humidity: 55,
      description: 'condiciones despejadas (mock)',
      icon: '01d',
    });
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Falta configuración del API key del clima' }, { status: 500 });
  }

  try {
    // 1) Obtener coordenadas si se recibe city
    let lat = latParam ? Number(latParam) : undefined;
    let lon = lonParam ? Number(lonParam) : undefined;
    let resolvedCity = city?.trim();
    let country = '';

    if (!lat || !lon) {
      // Geocodificación directa (city -> lat/lon)
      const geoUrl = new URL('https://api.openweathermap.org/geo/1.0/direct');
      geoUrl.searchParams.set('q', resolvedCity);
      geoUrl.searchParams.set('limit', '1');
      geoUrl.searchParams.set('appid', apiKey);

      const geoRes = await fetch(geoUrl.toString(), { next: { revalidate: 3600 } });
      if (!geoRes.ok) {
        const txt = await geoRes.text();
        return NextResponse.json({ error: `Error geocodificando ciudad: ${txt}` }, { status: geoRes.status });
      }
      const geo = await geoRes.json();
      if (!Array.isArray(geo) || geo.length === 0) {
        return NextResponse.json({ error: 'Ciudad no encontrada' }, { status: 404 });
      }
      lat = geo[0]?.lat;
      lon = geo[0]?.lon;
      resolvedCity = geo[0]?.name || resolvedCity;
      country = geo[0]?.country || '';
    }

    // 2) Consultar One Call 3.0 con lat/lon
    const oneCallUrl = new URL('https://api.openweathermap.org/data/3.0/onecall');
    oneCallUrl.searchParams.set('lat', String(lat));
    oneCallUrl.searchParams.set('lon', String(lon));
    oneCallUrl.searchParams.set('exclude', 'minutely,hourly,daily,alerts');
    oneCallUrl.searchParams.set('appid', apiKey);
    oneCallUrl.searchParams.set('units', 'metric');
    oneCallUrl.searchParams.set('lang', 'es');

    const res = await fetch(oneCallUrl.toString(), { next: { revalidate: 60 } });
    const body = await res.json();
    if (!res.ok) {
      const message = body?.message || 'Error consultando el clima';
      return NextResponse.json({ error: message }, { status: res.status });
    }

    const normalized = {
      city: resolvedCity || `${lat},${lon}`,
      country,
      tempC: body?.current?.temp,
      humidity: body?.current?.humidity,
      description: body?.current?.weather?.[0]?.description || '',
      icon: body?.current?.weather?.[0]?.icon || undefined,
    };

    return NextResponse.json(normalized);
  } catch (err) {
    return NextResponse.json({ error: 'No se pudo conectar al servicio de clima' }, { status: 502 });
  }
}
