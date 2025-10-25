import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WeatherSearch from '../components/WeatherSearch';

describe('WeatherSearch', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  test('muestra información de clima tras una búsqueda exitosa', async () => {
    const mockData = {
      city: 'Madrid',
      country: 'ES',
      tempC: 21.2,
      humidity: 50,
      description: 'cielo claro',
    };
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    render(<WeatherSearch />);
    const input = screen.getByLabelText('input-ciudad');
    const button = screen.getByLabelText('boton-buscar');

    fireEvent.change(input, { target: { value: 'Madrid' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Clima en Madrid, ES/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Temperatura:/)).toBeInTheDocument();
    expect(screen.getByText(/Humedad:/)).toBeInTheDocument();
    expect(screen.getByText(/Descripción:/)).toBeInTheDocument();
  });

  test('maneja correctamente un error por ciudad inválida', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'city not found' }),
    });

    render(<WeatherSearch />);
    const input = screen.getByLabelText('input-ciudad');
    const button = screen.getByLabelText('boton-buscar');

    fireEvent.change(input, { target: { value: 'CiudadImposibleXYZ' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/city not found/i);
    });
  });

  test('input y botón funcionan correctamente', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ city: 'Lima', country: 'PE', tempC: 18, humidity: 70, description: 'nublado' }),
    });

    render(<WeatherSearch />);
    const input = screen.getByLabelText('input-ciudad');
    const button = screen.getByLabelText('boton-buscar');

    fireEvent.change(input, { target: { value: 'Lima' } });
    fireEvent.click(button);

    await waitFor(() => expect(fetchSpy).toHaveBeenCalled());
    expect(fetchSpy).toHaveBeenCalledWith('/api/weather?city=Lima');
  });

  test('muestra error si no se ingresa ciudad y no llama a fetch', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    render(<WeatherSearch />);
    const button = screen.getByLabelText('boton-buscar');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/por favor ingresa una ciudad/i);
    });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  test('presionar Enter en el input dispara la búsqueda', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ city: 'Bogotá', country: 'CO', tempC: 19, humidity: 60, description: 'parcialmente nublado' }),
    });
    render(<WeatherSearch />);
    const input = screen.getByLabelText('input-ciudad');
    fireEvent.change(input, { target: { value: 'Bogotá' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    await waitFor(() => expect(fetchSpy).toHaveBeenCalled());
    expect(fetchSpy).toHaveBeenCalledWith('/api/weather?city=Bogot%C3%A1');
  });

  test('muestra mensaje de error cuando fetch rechaza (error de red)', async () => {
    jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('falló la red'));
    render(<WeatherSearch />);
    const input = screen.getByLabelText('input-ciudad');
    const button = screen.getByLabelText('boton-buscar');
    fireEvent.change(input, { target: { value: 'Quito' } });
    fireEvent.click(button);
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/falló la red/i);
    });
  });
});
