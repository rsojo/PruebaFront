"use client";

import { useState } from "react";

export default function WeatherSearch() {
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  const onSearch = async () => {
    setError("");
    setData(null);
    if (!city.trim()) {
      setError("Por favor ingresa una ciudad.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/weather?city=${encodeURIComponent(city.trim())}`);
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.error || "No se pudo obtener el clima");
      }
      setData(json);
    } catch (e) {
      setError(e.message || "Error al consultar el clima");
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') onSearch();
  };

  const iconUrl = data?.icon ? `https://openweathermap.org/img/wn/${data.icon}@2x.png` : null;

  return (
    <section aria-label="buscador-clima" className="panel">
      <div className="row" style={{ marginBottom: 10 }}>
        <input
          className="input"
          aria-label="input-ciudad"
          placeholder="Ej: Madrid"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <button className="button" onClick={onSearch} disabled={loading} aria-label="boton-buscar">
          {loading ? (<span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><span className="spinner" aria-hidden></span> Buscando…</span>) : 'Buscar'}
        </button>
      </div>
      {error && (
        <div role="alert" className="alert" style={{ marginTop: 10 }}>
          {error}
        </div>
      )}
      {data && (
        <div className="panel" style={{ marginTop: 12 }}>
          <div className="result">
            <div className="weather-icon" aria-hidden={iconUrl ? "false" : "true"}>
              {iconUrl ? (
                <img src={iconUrl} alt={data.description} width={64} height={64} />
              ) : (
                <span className="muted">—</span>
              )}
            </div>
            <div className="meta">
              <h2>Clima en {data.city}{data.country ? `, ${data.country}` : ''}</h2>
              <ul className="kv">
                <li>
                  <strong>Temperatura:</strong> {Math.round(data.tempC)}°C
                </li>
                <li>
                  <strong>Humedad:</strong> {data.humidity}%
                </li>
                <li>
                  <strong>Descripción:</strong> {data.description}
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
