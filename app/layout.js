import './globals.css';

export const metadata = {
  title: 'Clima Simple',
  description: 'Consulta el clima actual por ciudad',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}
