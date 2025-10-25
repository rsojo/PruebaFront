import WeatherSearch from "../components/WeatherSearch";
import ThemeToggle from "../components/ThemeToggle";

export default function Page() {
  return (
    <main className="container">
      <header className="site">
        <h1 className="title">Aplicación de Clima</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="muted" aria-hidden>Consulta condiciones actuales</span>
          <ThemeToggle />
        </div>
      </header>
      <WeatherSearch />
      <div className="footer">Datos provistos por OpenWeatherMap</div>
    </main>
  );
}
