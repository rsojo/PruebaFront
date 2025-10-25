# Aplicación de Clima

Aplicación web en Next.js que permite consultar el clima actual de una ciudad usando OpenWeatherMap. Muestra temperatura (°C), humedad (%) y una breve descripción del clima.

## Requisitos

- Node.js 18 o superior
- API Key de OpenWeatherMap

## Configuración rápida

1) Variables de entorno

```bash
cp .env.example .env.local
echo "OPENWEATHER_API_KEY=TU_API_KEY" >> .env.local
```

2) Instalación

```bash
npm install
```

## Ejecución

Desarrollo:
```bash
npm run dev
```
Abrir http://localhost:3000

Producción:
```bash
npm run build
npm start
```

## Pruebas

```bash
npm test
```
