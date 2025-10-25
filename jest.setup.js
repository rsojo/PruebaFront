import '@testing-library/jest-dom';

// Proveer fetch en el entorno de pruebas para poder hacer spyOn sobre él
if (!global.fetch) {
	Object.defineProperty(global, 'fetch', {
		value: () => Promise.reject(new Error('fetch no implementado en tests')),
		writable: true,
		configurable: true,
	});
}
