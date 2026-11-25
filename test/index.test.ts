import { API_URL, fetchData, getConfig } from '../src';

describe('index', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  describe('getConfig', () => {
    it('should read the credentials from environment variables', () => {
      const config = getConfig({ API_KEY: 'key-test', GITHUB_TOKEN: 'tok-test' });

      expect(config).toEqual({ apiKey: 'key-test', githubToken: 'tok-test' });
    });

    it('should return undefined values when the variables are not set', () => {
      expect(getConfig({})).toEqual({ apiKey: undefined, githubToken: undefined });
    });

    it('should use process.env by default', () => {
      process.env.API_KEY = 'env-key';

      expect(getConfig().apiKey).toBe('env-key');

      delete process.env.API_KEY;
    });
  });

  describe('fetchData', () => {
    it('should not call the API when API_KEY is not set', async () => {
      const fetchMock = jest.fn();
      global.fetch = fetchMock;
      jest.spyOn(console, 'warn').mockImplementation(() => undefined);

      const result = await fetchData({});

      expect(result).toBeUndefined();
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('should send the key in the "x-api-key" header and not in the URL', async () => {
      const data = { ok: true };
      const fetchMock = jest.fn().mockResolvedValue({ json: () => Promise.resolve(data) });
      global.fetch = fetchMock;
      const infoSpy = jest.spyOn(console, 'info').mockImplementation(() => undefined);

      const result = await fetchData({ apiKey: 'key-test' });

      expect(fetchMock).toHaveBeenCalledWith(API_URL, {
        headers: { 'x-api-key': 'key-test' },
      });
      expect(fetchMock.mock.calls[0][0]).not.toContain('key-test');
      expect(result).toEqual(data);
      expect(infoSpy).toHaveBeenCalledWith('Consulta a la API completada.');
    });

    it('should not log the API response', async () => {
      const data = { mensaje: 'no-debe-loguearse' };
      global.fetch = jest.fn().mockResolvedValue({ json: () => Promise.resolve(data) });
      const logSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);
      const infoSpy = jest.spyOn(console, 'info').mockImplementation(() => undefined);

      await fetchData({ apiKey: 'key-test' });

      expect(logSpy).not.toHaveBeenCalled();
      expect(JSON.stringify(infoSpy.mock.calls)).not.toContain('no-debe-loguearse');
    });

    it('should return undefined and log only a fixed message when the request fails', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('detalle-interno'));
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

      const result = await fetchData({ apiKey: 'key' });

      expect(result).toBeUndefined();
      expect(errorSpy).toHaveBeenCalledWith('Error al consultar la API.');
    });

    it('should use the configuration from the environment by default', async () => {
      const fetchMock = jest.fn();
      global.fetch = fetchMock;
      jest.spyOn(console, 'warn').mockImplementation(() => undefined);
      delete process.env.API_KEY;

      await fetchData();

      expect(fetchMock).not.toHaveBeenCalled();
    });
  });
});
